namespace Backend.Contracts.Responses;

/// <summary>
/// Consistent API envelope used for all responses.
/// </summary>
/// <typeparam name="T">Payload type.</typeparam>
public class ApiResponse<T>
{
    private ApiResponse(bool success, string message, T? data, object? errors)
    {
        Success = success;
        Message = message;
        Data = data;
        Errors = errors;
    }

    public bool Success { get; }

    public string Message { get; }

    public T? Data { get; }

    public object? Errors { get; }

    public static ApiResponse<T> SuccessResponse(T data, string message = "") => new(true, message, data, null);

    public static ApiResponse<T> FailureResponse(string message, object? errors = null) => new(false, message, default, errors);
}
