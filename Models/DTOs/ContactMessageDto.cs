namespace DevoBackend.Models.DTOs;


public class ContactMessageDto
{
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Subject { get; set; } = null!;
    public string Message { get; set; } = null!;
}
