namespace DevoBackend.Models
{
    public class UserActivity
    {
        public int UserActivityId { get; set; }
        public int UserId { get; set; }
        public string Action { get; set; } = null!;
        public int? RelatedTaskId { get; set; }
        public int? RelatedMeetingId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public User User { get; set; } = null!;
        public AssignedTask? Task { get; set; }
        public Meeting? Meeting { get; set; }
    }

}
