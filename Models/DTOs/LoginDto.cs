using System.ComponentModel.DataAnnotations;

namespace DevoBackend.Models.DTOs
{
  public class LoginDto
  {
    public string Email { get; set; }
    public string PasswordHash { get; set; }
  }
}
