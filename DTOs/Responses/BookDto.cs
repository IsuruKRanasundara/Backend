namespace Backend.DTOs.Responses;

/// <summary>
/// Representation of a book returned to clients.
/// </summary>
public class BookDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Author { get; set; } = string.Empty;

    public string ISBN { get; set; } = string.Empty;

    public DateTime PublicationDate { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
