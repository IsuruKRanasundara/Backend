namespace Backend.DTOs.Requests;

/// <summary>
/// Query string filters for the books endpoint.
/// </summary>
public class BookQueryParameters
{
    private const int MaxPageSize = 50;

    public string? Title { get; set; }

    public string? Author { get; set; }

    public string? Isbn { get; set; }

    public DateTime? PublishedFrom { get; set; }

    public DateTime? PublishedTo { get; set; }

    public string? SortBy { get; set; }

    public string? SortDirection { get; set; } = "asc";

    public int PageNumber { get; set; } = 1;

    private int _pageSize = 10;

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value > MaxPageSize ? MaxPageSize : Math.Max(1, value);
    }
}
