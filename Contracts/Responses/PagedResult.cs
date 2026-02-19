namespace Backend.Contracts.Responses;

/// <summary>
/// Represents a paginated collection of items and associated metadata.
/// </summary>
/// <typeparam name="T">Item type.</typeparam>
public class PagedResult<T>
{
    public required IReadOnlyCollection<T> Items { get; init; }

    public required PaginationMetadata Metadata { get; init; }
}

/// <summary>
/// Metadata describing pagination details returned in the response headers.
/// </summary>
public record PaginationMetadata(int TotalCount, int PageNumber, int PageSize, int TotalPages, bool HasNextPage, bool HasPreviousPage);
