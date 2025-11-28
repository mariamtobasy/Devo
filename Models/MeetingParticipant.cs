namespace DevoBackend.Models
{
    public class MeetingParticipant
    {
        public int MeetingId { get; set; }
        public int UserId { get; set; }

        public Meeting Meeting { get; set; } = null!;
        public User User { get; set; } = null!;
    }

}
