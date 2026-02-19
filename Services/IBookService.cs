using Backend.Contracts.Responses;
using Backend.DTOs.Requests;
using Backend.DTOs.Responses;

namespace Backend.Services;

/// <summary>
/// Encapsulates book-related business logic.
/// </summary>
public interface IBookService
{
    Task<PagedResult<BookDto>> GetAsync(BookQueryParameters parameters, CancellationToken cancellationToken);

    Task<BookDto?> GetByIdAsync(int id, CancellationToken cancellationToken);

    Task<BookDto> CreateAsync(CreateBookRequest request, CancellationToken cancellationToken);

    Task<BookDto?> UpdateAsync(int id, UpdateBookRequest request, CancellationToken cancellationToken);

    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken);
}
