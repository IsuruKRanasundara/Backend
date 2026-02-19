using Backend.Models;

namespace Backend.Repositories;

/// <summary>
/// Abstraction for book data persistence operations.
/// </summary>
public interface IBookRepository
{
    Task<IReadOnlyCollection<Book>> GetAllAsync(CancellationToken cancellationToken);

    Task<Book?> GetByIdAsync(int id, CancellationToken cancellationToken);

    Task<Book> AddAsync(Book book, CancellationToken cancellationToken);

    Task<Book?> UpdateAsync(Book book, CancellationToken cancellationToken);

    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken);
}
