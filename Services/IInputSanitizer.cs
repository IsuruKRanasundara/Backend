namespace Backend.Services;

/// <summary>
/// Sanitizes inbound user-provided data.
/// </summary>
public interface IInputSanitizer
{
    string Sanitize(string value);
}
