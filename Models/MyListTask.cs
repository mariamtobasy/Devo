using System;
using System.Collections.Generic;

namespace DevoBackend.Models
{
    public class MyListTask
    {
        public int MyListTaskId { get; set; }

        public int UserId { get; set; }

        public string Title { get; set; } = null!;
        public string? Description { get; set; }

        public string Priority { get; set; } = "medium";
        // urgent | medium | low

        public bool IsCompleted { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public User User { get; set; } = null!;

        public ICollection<TaskHistory> Histories { get; set; } = new List<TaskHistory>();

    }
}

