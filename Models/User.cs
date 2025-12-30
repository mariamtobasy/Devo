using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using DevoBackend.Models; // <-- where all your model classes are

namespace DevoBackend.Models   // <--- THIS was missing
{
  public class User
  {
     public int UserId { get; set; }
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string JobTitle { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public string Location { get; set; } = null!;
    public string Role { get; set; } = null!;
    public string ProfilePhoto { get; set; } = null!;
    public string DepartmentId { get; set; } = null!;
        public string ReportsTo { get; set; } // optional manager/supervisor
    public string Organization { get; set; } // optional organization/company name

        // NEW FIELDS
        public bool CookiesAccepted { get; set; } = false;
        public bool TwoFactorEnabled { get; set; } = false;
        public string Language { get; set; } = "English";
        public string TimeZone { get; set; } = "UTC";
     
        //  public string UserName { get; set; }

        // Navigation properties
        // ONLY what you are using now
        public ICollection<AssignedTask> AssignedTasks { get; set; }
        = new List<AssignedTask>();

        public ICollection<MyListTask> MyListTasks { get; set; }
            = new List<MyListTask>();
    }
}


