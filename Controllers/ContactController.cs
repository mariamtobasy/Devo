using DevoBackend.Data;
using DevoBackend.Models;
using DevoBackend.Models.DTOs;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly DevoDbContext _context;

    public ContactController(DevoDbContext context)
    {
        _context = context;
    }

    [HttpPost("sendMessage")]
    public IActionResult SendMessage([FromBody] ContactMessageDto dto)
    {
        var message = new ContactMessage
        {
            Subject = dto.Subject,
            Content = dto.Message,
            CreatedAt = DateTime.Now
        };

        _context.ContactMessages.Add(message);
        _context.SaveChanges();

        return Ok(new { message = "Message sent successfully" });
    }
}
