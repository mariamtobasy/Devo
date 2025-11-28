using System.ComponentModel.DataAnnotations;

namespace DevoBackend.Models.DTOs
{
  public class RegisterRequest
  {
    [Required(ErrorMessage = "Full name is required")]
    public string FullName { get; set; } = null!;

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email address")]
    public string Email { get; set; } = null!;

    [Required(ErrorMessage = "Password is required")]
    // Optional: add regex for password complexity
    // [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,20}$", ErrorMessage = "Password does not meet complexity requirements")]
    public string PasswordHash { get; set; } = null!;

    [Required(ErrorMessage = "Job title is required")]
    public string JobTitle { get; set; } = null!;

    [Phone(ErrorMessage = "Invalid phone number")]
    public string PhoneNumber { get; set; }

    public string? Location { get; set; }

    public string Role { get; set; }

    public string? DepartmentId { get; set; }

    public string? ProfilePhoto { get; set; } // optional, base64 or URL

    // New fields
    public string ReportsTo { get; set; } // optional manager/supervisor
    public string? Organization { get; set; } // optional organization/company name
  }
}

