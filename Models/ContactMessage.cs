namespace DevoBackend.Models
{
    public class ContactMessage
    {
        public int ContactMessageId { get; set; }
        public int? UserId { get; set; }
        public string Subject { get; set; } = null!;
        public string Content { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public User? User { get; set; }
    }

}
