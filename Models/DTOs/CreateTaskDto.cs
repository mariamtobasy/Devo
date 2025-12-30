// DTOs/CreateTaskDto.cs
namespace DevoBackend.Models.DTOs;

public class CreateTaskDto
{
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public List<string> Tags { get; set; } = new();
    public string AssignedToEmail { get; set; } = "";
    public string Status { get; set; } = "";
    public DateTime? DueDate { get; set; }  
   public DateTime CreatedAt { get; set; } // timestamp
}
