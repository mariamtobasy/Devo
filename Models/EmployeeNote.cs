using System.ComponentModel.DataAnnotations;

namespace DevoBackend.Models
{
	public class EmployeeNote
	{
		[Key]
		public int Id { get; set; }
		[Required]
		public int EmployeeId { get; set; }   // who wrote the note (optional)
		[Required]
		public string Title { get; set; }
		public string Content { get; set; }
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
		public DateTime? UpdatedAt { get; set; }
	}
}