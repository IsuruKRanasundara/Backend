using Backend.DTOs.Responses;
using Backend.Models;

namespace Backend.Extensions;

/// <summary>
/// Helper mapping extensions between domain entities and DTOs.
/// </summary>
public static class BookMappingExtensions
{
    public static BookDto ToDto(this Book book) => new()
    {
        Id = book.Id,
        Title = book.Title,
        Author = book.Author,
        ISBN = book.ISBN,
        PublicationDate = book.PublicationDate,
        CreatedAt = book.CreatedAt,
        UpdatedAt = book.UpdatedAt
    };
}
