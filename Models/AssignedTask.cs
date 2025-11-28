using System;

namespace DevoBackend.Models
{
    public class AssignedTask
    {
        public int AssignedTaskId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string? Status { get; set; } // Could be enum
        public string? Priority { get; set; } // Could be enum
        public string? Label { get; set; }
        public int? ProjectId { get; set; }
        public int? AssignedTo { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? DueDate { get; set; }
        public string? Recurrence { get; set; }

        // Navigation properties
        public User? Assignee { get; set; }
        public User? Creator { get; set; }
        public ICollection<TaskComment> Comments { get; set; } = new List<TaskComment>();
        public ICollection<TaskHistory> Histories { get; set; } = new List<TaskHistory>();
        public ICollection<UserActivity> UserActivities { get; set; } = new List<UserActivity>();
    }

}

