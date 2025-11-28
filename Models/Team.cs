using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using DevoBackend.Models;


namespace DevoBackend.Models
{
    public class Team
    {
        public int TeamId { get; set; }
        public string Name { get; set; } = null!;
        public int CreatedBy { get; set; }

        // Navigation properties
        public User Creator { get; set; } = null!;
        public ICollection<TeamMember> Members { get; set; } = new List<TeamMember>();
    }
}

