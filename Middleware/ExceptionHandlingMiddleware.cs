using System.Net;
using System.Text.Json;
using Backend.Contracts.Responses;
using FluentValidation;
using Microsoft.AspNetCore.Http;

namespace Backend.Middleware;

/// <summary>
/// Intercepts unhandled exceptions and converts them into consistent API responses.
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;
    private readonly JsonSerializerOptions _serializerOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
    };

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context).ConfigureAwait(false);
        }
        catch (OperationCanceledException) when (context.RequestAborted.IsCancellationRequested)
        {
            context.Response.StatusCode = 499; // Client closed request
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex).ConfigureAwait(false);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, errors) = exception switch
        {
            ValidationException validationException => (StatusCodes.Status400BadRequest, validationException.Errors.Select(e => e.ErrorMessage).ToArray()),
            _ => (StatusCodes.Status500InternalServerError, Array.Empty<string>())
        };

        _logger.LogError(exception, "An unhandled exception occurred");

        var payload = ApiResponse<object>.FailureResponse("Request failed", errors.Length == 0 ? null : errors);

        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonSerializer.Serialize(payload, _serializerOptions)).ConfigureAwait(false);
    }
}
