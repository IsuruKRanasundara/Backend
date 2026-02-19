using Backend.Contracts.Responses;
using Backend.DTOs.Requests;
using Backend.DTOs.Responses;
using Backend.Extensions;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services;

/// <summary>
/// Implements business logic for book operations.
/// </summary>
public class BookService : IBookService
{
    private readonly IBookRepository _bookRepository;
    private readonly IInputSanitizer _inputSanitizer;
    private readonly ILogger<BookService> _logger;

    public BookService(IBookRepository bookRepository, IInputSanitizer inputSanitizer, ILogger<BookService> logger)
    {
        _bookRepository = bookRepository;
        _inputSanitizer = inputSanitizer;
        _logger = logger;
    }

    public async Task<PagedResult<BookDto>> GetAsync(BookQueryParameters parameters, CancellationToken cancellationToken)
    {
        var books = await _bookRepository.GetAllAsync(cancellationToken).ConfigureAwait(false);
        var query = books.AsQueryable();

        if (!string.IsNullOrWhiteSpace(parameters.Title))
        {
            var title = _inputSanitizer.Sanitize(parameters.Title);
            query = query.Where(b => b.Title.Contains(title, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(parameters.Author))
        {
            var author = _inputSanitizer.Sanitize(parameters.Author);
            query = query.Where(b => b.Author.Contains(author, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(parameters.Isbn))
        {
            var isbn = _inputSanitizer.Sanitize(parameters.Isbn);
            query = query.Where(b => b.ISBN.Equals(isbn, StringComparison.OrdinalIgnoreCase));
        }

        if (parameters.PublishedFrom.HasValue)
        {
            query = query.Where(b => b.PublicationDate >= parameters.PublishedFrom.Value);
        }

        if (parameters.PublishedTo.HasValue)
        {
            query = query.Where(b => b.PublicationDate <= parameters.PublishedTo.Value);
        }

        query = ApplySorting(query, parameters.SortBy, parameters.SortDirection);

        var totalCount = query.Count();
        var skip = (parameters.PageNumber - 1) * parameters.PageSize;
        var items = query.Skip(skip).Take(parameters.PageSize).Select(b => b.ToDto()).ToList();

        var totalPages = totalCount == 0 ? 0 : (int)Math.Ceiling(totalCount / (double)parameters.PageSize);
        var metadata = new PaginationMetadata(totalCount, parameters.PageNumber, parameters.PageSize, totalPages, parameters.PageNumber < totalPages, parameters.PageNumber > 1);

        return new PagedResult<BookDto>
        {
            Items = items,
            Metadata = metadata
        };
    }

    public async Task<BookDto?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        var book = await _bookRepository.GetByIdAsync(id, cancellationToken).ConfigureAwait(false);
        return book?.ToDto();
    }

    public async Task<BookDto> CreateAsync(CreateBookRequest request, CancellationToken cancellationToken)
    {
        var book = new Book
        {
            Title = _inputSanitizer.Sanitize(request.Title),
            Author = _inputSanitizer.Sanitize(request.Author),
            ISBN = _inputSanitizer.Sanitize(request.ISBN),
            PublicationDate = request.PublicationDate,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _bookRepository.AddAsync(book, cancellationToken).ConfigureAwait(false);
        _logger.LogInformation("Book {BookTitle} (ID: {BookId}) created", created.Title, created.Id);
        return created.ToDto();
    }

    public async Task<BookDto?> UpdateAsync(int id, UpdateBookRequest request, CancellationToken cancellationToken)
    {
        var existing = await _bookRepository.GetByIdAsync(id, cancellationToken).ConfigureAwait(false);
        if (existing is null)
        {
            return null;
        }

        existing.Title = _inputSanitizer.Sanitize(request.Title);
        existing.Author = _inputSanitizer.Sanitize(request.Author);
        existing.ISBN = _inputSanitizer.Sanitize(request.ISBN);
        existing.PublicationDate = request.PublicationDate;
        existing.UpdatedAt = DateTime.UtcNow;

        var updated = await _bookRepository.UpdateAsync(existing, cancellationToken).ConfigureAwait(false);
        _logger.LogInformation("Book ID {BookId} updated", id);
        return updated?.ToDto();
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var removed = await _bookRepository.DeleteAsync(id, cancellationToken).ConfigureAwait(false);
        if (removed)
        {
            _logger.LogInformation("Book ID {BookId} deleted", id);
        }

        return removed;
    }

    private static IQueryable<Book> ApplySorting(IQueryable<Book> query, string? sortBy, string? sortDirection)
    {
        var isDescending = string.Equals(sortDirection, "desc", StringComparison.OrdinalIgnoreCase);

        return sortBy?.ToLowerInvariant() switch
        {
            "author" => isDescending ? query.OrderByDescending(b => b.Author) : query.OrderBy(b => b.Author),
            "publicationdate" => isDescending ? query.OrderByDescending(b => b.PublicationDate) : query.OrderBy(b => b.PublicationDate),
            "isbn" => isDescending ? query.OrderByDescending(b => b.ISBN) : query.OrderBy(b => b.ISBN),
            _ => isDescending ? query.OrderByDescending(b => b.Title) : query.OrderBy(b => b.Title)
        };
    }
}
