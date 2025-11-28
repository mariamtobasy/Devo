using Microsoft.EntityFrameworkCore;
using DevoBackend.Models;

namespace DevoBackend.Models
{
    public class TaskHistory
    {
        public int TaskHistoryId { get; set; }
        public int TaskId { get; set; }
        public string Action { get; set; } = null!;
        public int PerformedBy { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;

        public AssignedTask Task { get; set; } = null!;
        public User User { get; set; } = null!;
    }

}
