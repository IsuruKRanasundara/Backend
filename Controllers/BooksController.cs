using System.Text.Json;
using Backend.Contracts.Responses;
using Backend.DTOs.Requests;
using Backend.DTOs.Responses;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

/// <summary>
/// REST API for managing books.
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/books")]
[Route("api/books")]
public class BooksController : ControllerBase
{
    private static readonly JsonSerializerOptions PaginationSerializerOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    private readonly IBookService _bookService;
    private readonly ILogger<BooksController> _logger;

    public BooksController(IBookService bookService, ILogger<BooksController> logger)
    {
        _bookService = bookService;
        _logger = logger;
    }

    /// <summary>
    /// Retrieves books with optional filtering, sorting, and pagination.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<BookDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetBooks([FromQuery] BookQueryParameters parameters, CancellationToken cancellationToken)
    {
        var pagedResult = await _bookService.GetAsync(parameters, cancellationToken).ConfigureAwait(false);
        Response.Headers["X-Pagination"] = JsonSerializer.Serialize(pagedResult.Metadata, PaginationSerializerOptions);
        return Ok(ApiResponse<IEnumerable<BookDto>>.SuccessResponse(pagedResult.Items, "Books retrieved successfully."));
    }

    /// <summary>
    /// Retrieves a single book by identifier.
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<BookDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetBookById(int id, CancellationToken cancellationToken)
    {
        var book = await _bookService.GetByIdAsync(id, cancellationToken).ConfigureAwait(false);
        if (book is null)
        {
            return NotFound(ApiResponse<object>.FailureResponse("Book not found."));
        }

        return Ok(ApiResponse<BookDto>.SuccessResponse(book, "Book retrieved successfully."));
    }

    /// <summary>
    /// Creates a new book.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<BookDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateBook([FromBody] CreateBookRequest request, CancellationToken cancellationToken)
    {
        var created = await _bookService.CreateAsync(request, cancellationToken).ConfigureAwait(false);
        var routeValues = new { id = created.Id, version = HttpContext.GetRequestedApiVersion()?.ToString() ?? "1.0" };
        return CreatedAtAction(nameof(GetBookById), routeValues, ApiResponse<BookDto>.SuccessResponse(created, "Book created successfully."));
    }

    /// <summary>
    /// Updates an existing book.
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<BookDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateBook(int id, [FromBody] UpdateBookRequest request, CancellationToken cancellationToken)
    {
        var updated = await _bookService.UpdateAsync(id, request, cancellationToken).ConfigureAwait(false);
        if (updated is null)
        {
            return NotFound(ApiResponse<object>.FailureResponse("Book not found."));
        }

        return Ok(ApiResponse<BookDto>.SuccessResponse(updated, "Book updated successfully."));
    }

    /// <summary>
    /// Deletes a book by identifier.
    /// </summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteBook(int id, CancellationToken cancellationToken)
    {
        var removed = await _bookService.DeleteAsync(id, cancellationToken).ConfigureAwait(false);
        if (!removed)
        {
            return NotFound(ApiResponse<object>.FailureResponse("Book not found."));
        }

        return NoContent();
    }
}
