using Backend.DTOs.Requests;
using FluentValidation;

namespace Backend.Validators;

/// <summary>
/// Validator for create book requests.
/// </summary>
public class CreateBookRequestValidator : AbstractValidator<CreateBookRequest>
{
    public CreateBookRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .Length(1, 200);

        RuleFor(x => x.Author)
            .NotEmpty()
            .Length(2, 100);

        RuleFor(x => x.ISBN)
            .NotEmpty()
            .Matches(@"^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$")
            .WithMessage("ISBN is not in a valid format.");

        RuleFor(x => x.PublicationDate)
            .LessThanOrEqualTo(DateTime.UtcNow)
            .WithMessage("Publication date cannot be in the future.");
    }
}
