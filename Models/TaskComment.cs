namespace DevoBackend.Models
{
    public class TaskComment
    {
        public int TaskCommentId { get; set; }
        public int TaskId { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public AssignedTask Task { get; set; } = null!;
        public User User { get; set; } = null!;
    }

}
