namespace DevoBackend.Models
{
    public class TeamMember
    {
        public int TeamId { get; set; }
        public int UserId { get; set; }
        public string? RoleInTeam { get; set; }

        // Navigation properties
        public Team Team { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}
