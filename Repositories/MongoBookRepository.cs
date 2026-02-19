using Backend.Models;
using MongoDB.Driver;

namespace Backend.Repositories;

/// <summary>
/// MongoDB implementation of the book repository.
/// </summary>
public class MongoBookRepository : IBookRepository
{
    private readonly IMongoCollection<Book> _collection;

    public MongoBookRepository(IMongoCollection<Book> collection)
    {
        _collection = collection;
    }

    public async Task<IReadOnlyCollection<Book>> GetAllAsync(CancellationToken cancellationToken)
    {
        var books = await _collection.Find(FilterDefinition<Book>.Empty).ToListAsync(cancellationToken).ConfigureAwait(false);
        return books;
    }

    public async Task<Book?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        return await _collection.Find(book => book.Id == id).FirstOrDefaultAsync(cancellationToken).ConfigureAwait(false);
    }

    public async Task<Book> AddAsync(Book book, CancellationToken cancellationToken)
    {
        book.Id = await GetNextIdAsync(cancellationToken).ConfigureAwait(false);
        await _collection.InsertOneAsync(book, cancellationToken: cancellationToken).ConfigureAwait(false);
        return book;
    }

    public async Task<Book?> UpdateAsync(Book book, CancellationToken cancellationToken)
    {
        var result = await _collection.ReplaceOneAsync(b => b.Id == book.Id, book, cancellationToken: cancellationToken).ConfigureAwait(false);
        return result.ModifiedCount == 0 ? null : book;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var result = await _collection.DeleteOneAsync(book => book.Id == id, cancellationToken).ConfigureAwait(false);
        return result.DeletedCount > 0;
    }

    private async Task<int> GetNextIdAsync(CancellationToken cancellationToken)
    {
        var lastBook = await _collection.Find(FilterDefinition<Book>.Empty)
            .SortByDescending(book => book.Id)
            .Limit(1)
            .FirstOrDefaultAsync(cancellationToken)
            .ConfigureAwait(false);

        return lastBook is null ? 1 : lastBook.Id + 1;
    }
}
