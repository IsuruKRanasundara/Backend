namespace Backend.Options;

/// <summary>
/// Strongly typed MongoDB configuration settings.
/// </summary>
public class MongoDbSettings
{
    public string ConnectionString { get; set; } = string.Empty;

    public string DatabaseName { get; set; } = string.Empty;

    public string BooksCollectionName { get; set; } = "books";
}
