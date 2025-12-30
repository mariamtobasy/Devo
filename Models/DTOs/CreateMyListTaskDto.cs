namespace DevoBackend.Models.DTOs;

public class CreateMyListTaskDto
{
	public string? Title { get; set; }
	public string? Description { get; set; }
	public string? Priority { get; set; }
	public bool? IsCompleted { get; set; }
}
