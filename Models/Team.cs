using System.Text.Json.Serialization;

namespace DevoBackend.Models
{
    public class Team
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<TeamMember> Members { get; set; }
        public ICollection<TeamTask> Tasks { get; set; }
        public ICollection<TeamMessage> ChatMessages { get; set; }
    }
    public class TeamMember
    {
        public int Id { get; set; }
        public int TeamId { get; set; }
        public int UserId { get; set; }   // link to your Users table id
        public string Role { get; set; }  // Admin, Manager, Employee
        public bool IsOnline { get; set; } = false;
        public DateTime? LastSeen { get; set; }
        [JsonIgnore]
        public Team? Team { get; set; }
    }
    public class TeamTask
    {
        public int Id { get; set; }
        public int TeamId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int? AssignedToUserId { get; set; } // member user id
        public string Status { get; set; } = "To Do"; // To Do, In Progress, Done
        public DateTime? DueDate { get; set; }
        public bool Pinned { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        [JsonIgnore]
        public Team? Team { get; set; }
    }


    public class TeamActivity
    {
        public int Id { get; set; }
        public int TeamId { get; set; }
        public string Message { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class TeamMessage
    {
        public int Id { get; set; }
        public int TeamId { get; set; }
        public int SenderUserId { get; set; }
        public string SenderName { get; set; }
        public string Text { get; set; }
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
        [JsonIgnore]
        public Team? Team { get; set; }  // navigation property for EF

    }
}