using System;
using System.Collections.Generic;

namespace DevoBackend.Models
{
    public class AssignedTask
    {
        public int AssignedTaskId { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Tags { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; } = "Todo";
        public int CreatedBy { get; set; }
        public int AssignedTo { get; set; }
        public DateTime? DueDate { get; set; }

      
    }
}


