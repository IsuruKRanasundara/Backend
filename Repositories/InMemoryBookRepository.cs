using Backend.Models;

namespace Backend.Repositories;

/// <summary>
/// Thread-safe in-memory repository implementation for demo purposes.
/// </summary>
public class InMemoryBookRepository : IBookRepository
{
    private readonly List<Book> _books = new();
    private readonly SemaphoreSlim _lock = new(1, 1);
    private int _nextId = 1;

    public InMemoryBookRepository()
    {
        SeedData();
    }

    public async Task<IReadOnlyCollection<Book>> GetAllAsync(CancellationToken cancellationToken)
    {
        await _lock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            return _books.Select(Clone).ToList();
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<Book?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        await _lock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            return _books.FirstOrDefault(b => b.Id == id) is { } book ? Clone(book) : null;
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<Book> AddAsync(Book book, CancellationToken cancellationToken)
    {
        await _lock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            book.Id = _nextId++;
            _books.Add(Clone(book));
            return Clone(book);
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<Book?> UpdateAsync(Book book, CancellationToken cancellationToken)
    {
        await _lock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            var index = _books.FindIndex(b => b.Id == book.Id);
            if (index < 0)
            {
                return null;
            }

            _books[index] = Clone(book);
            return Clone(book);
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        await _lock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            var removed = _books.RemoveAll(b => b.Id == id) > 0;
            return removed;
        }
        finally
        {
            _lock.Release();
        }
    }

    private static Book Clone(Book book) => new()
    {
        Id = book.Id,
        Title = book.Title,
        Author = book.Author,
        ISBN = book.ISBN,
        PublicationDate = book.PublicationDate,
        CreatedAt = book.CreatedAt,
        UpdatedAt = book.UpdatedAt
    };

    private void SeedData()
    {
        _books.AddRange(new[]
        {
            new Book
            {
                Id = _nextId++,
                Title = "The Pragmatic Programmer",
                Author = "Andrew Hunt",
                ISBN = "978-0201616224",
                PublicationDate = new DateTime(1999, 10, 30),
                CreatedAt = DateTime.UtcNow
            },
            new Book
            {
                Id = _nextId++,
                Title = "Clean Code",
                Author = "Robert C. Martin",
                ISBN = "978-0132350884",
                PublicationDate = new DateTime(2008, 8, 1),
                CreatedAt = DateTime.UtcNow
            }
        });
    }
}
