using Backend.DTOs.Requests;
using FluentValidation;

namespace Backend.Validators;

/// <summary>
/// Validator for query string parameters when listing books.
/// </summary>
public class BookQueryParametersValidator : AbstractValidator<BookQueryParameters>
{
    private static readonly string[] AllowedSortFields = { "title", "author", "publicationdate", "isbn" };

    public BookQueryParametersValidator()
    {
        RuleFor(x => x.PageNumber)
            .GreaterThan(0);

        RuleFor(x => x.PageSize)
            .GreaterThan(0)
            .LessThanOrEqualTo(50);

        RuleFor(x => x.SortBy)
            .Must(value => string.IsNullOrEmpty(value) || AllowedSortFields.Contains(value.ToLowerInvariant()))
            .WithMessage("SortBy must be one of title, author, publicationDate, or isbn.");

        RuleFor(x => x.SortDirection)
            .Must(value => string.IsNullOrEmpty(value) || value.Equals("asc", StringComparison.OrdinalIgnoreCase) || value.Equals("desc", StringComparison.OrdinalIgnoreCase))
            .WithMessage("SortDirection must be asc or desc.");

        RuleFor(x => x)
            .Must(x => !x.PublishedFrom.HasValue || !x.PublishedTo.HasValue || x.PublishedFrom <= x.PublishedTo)
            .WithMessage("PublishedFrom must be earlier than PublishedTo.");
    }
}
