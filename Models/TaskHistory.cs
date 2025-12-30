namespace DevoBackend.Models
{
    public class TaskHistory
    {
        public int TaskHistoryId { get; set; }

        // Assigned task history
        public int? AssignedTaskId { get; set; }
        public AssignedTask? AssignedTask { get; set; }

        // MyList task history
        public int? MyListTaskId { get; set; }
        public MyListTask? MyListTask { get; set; }

        public int PerformedBy { get; set; }
        public string Action { get; set; } = null!;
        public DateTime Timestamp { get; set; }
    }

}
