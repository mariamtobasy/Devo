namespace DevoBackend.Models
{
    public class Meeting
    {
        public int MeetingId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime? ScheduledAt { get; set; }
        public int CreatedBy { get; set; }

        public User Creator { get; set; } = null!;
        public ICollection<MeetingParticipant> Participants { get; set; } = new List<MeetingParticipant>();
        public ICollection<UserActivity> UserActivities { get; set; } = new List<UserActivity>();
    }

}
