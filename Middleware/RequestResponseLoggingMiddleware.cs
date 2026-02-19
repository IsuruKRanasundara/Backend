using System.Text;
using Microsoft.AspNetCore.Http.Extensions;

namespace Backend.Middleware;

/// <summary>
/// Logs incoming requests and outgoing responses for observability.
/// </summary>
public class RequestResponseLoggingMiddleware
{
    private const int MaxLoggedBodyLength = 2048;
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestResponseLoggingMiddleware> _logger;

    public RequestResponseLoggingMiddleware(RequestDelegate next, ILogger<RequestResponseLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var correlationId = Guid.NewGuid().ToString();
        context.Response.Headers.TryAdd("X-Correlation-Id", correlationId);

        await LogRequestAsync(context, correlationId).ConfigureAwait(false);

        var originalBodyStream = context.Response.Body;
        await using var responseBody = new MemoryStream();
        context.Response.Body = responseBody;

        await _next(context).ConfigureAwait(false);

        await LogResponseAsync(context, correlationId).ConfigureAwait(false);
        context.Response.Body.Seek(0, SeekOrigin.Begin);
        await responseBody.CopyToAsync(originalBodyStream).ConfigureAwait(false);
    }

    private async Task LogRequestAsync(HttpContext context, string correlationId)
    {
        context.Request.EnableBuffering();
        var bodyAsText = await ReadStreamAsync(context.Request.Body).ConfigureAwait(false);
        context.Request.Body.Position = 0;

        _logger.LogInformation("Request {Method} {Url} CorrelationId {CorrelationId} Body: {Body}",
            context.Request.Method,
            context.Request.GetDisplayUrl(),
            correlationId,
            bodyAsText);
    }

    private async Task LogResponseAsync(HttpContext context, string correlationId)
    {
        context.Response.Body.Seek(0, SeekOrigin.Begin);
        var text = await ReadStreamAsync(context.Response.Body).ConfigureAwait(false);
        context.Response.Body.Seek(0, SeekOrigin.Begin);

        _logger.LogInformation("Response {StatusCode} CorrelationId {CorrelationId} Body: {Body}",
            context.Response.StatusCode,
            correlationId,
            text);
    }

    private static async Task<string> ReadStreamAsync(Stream stream)
    {
        using var reader = new StreamReader(stream, Encoding.UTF8, leaveOpen: true);
        var text = await reader.ReadToEndAsync().ConfigureAwait(false);
        if (text.Length > MaxLoggedBodyLength)
        {
            return text[..MaxLoggedBodyLength] + "...";
        }

        return text;
    }
}
