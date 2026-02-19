using System.Text.RegularExpressions;

namespace Backend.Services;

/// <summary>
/// Basic sanitizer that trims whitespace and removes potentially dangerous characters.
/// </summary>
public class InputSanitizer : IInputSanitizer
{
    private static readonly Regex DisallowedCharacters = new("[<>\\\\]", RegexOptions.Compiled);

    public string Sanitize(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return string.Empty;
        }

        var cleaned = DisallowedCharacters.Replace(value, string.Empty);
        return cleaned.Trim();
    }
}
