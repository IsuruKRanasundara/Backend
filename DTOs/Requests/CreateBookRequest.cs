using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Requests;

/// <summary>
/// Request payload for creating a book record.
/// </summary>
public class CreateBookRequest
{
    [Required]
    [StringLength(200, MinimumLength = 1)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string Author { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$")]
    public string ISBN { get; set; } = string.Empty;

    [Required]
    public DateTime PublicationDate { get; set; }
}
