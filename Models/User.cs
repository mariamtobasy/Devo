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


    // Navigation properties
    public ICollection<Team> CreatedTeams { get; set; } = new List<Team>();
    public ICollection<TeamMember> TeamMemberships { get; set; } = new List<TeamMember>();
    public ICollection<AssignedTask> AssignedTasks { get; set; } = new List<AssignedTask>();
    public ICollection<AssignedTask> CreatedTasks { get; set; } = new List<AssignedTask>();
    public ICollection<TaskComment> TaskComments { get; set; } = new List<TaskComment>();
    public ICollection<TaskHistory> TaskHistories { get; set; } = new List<TaskHistory>();
    public ICollection<Meeting> CreatedMeetings { get; set; } = new List<Meeting>();
    public ICollection<MeetingParticipant> MeetingParticipations { get; set; } = new List<MeetingParticipant>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public ICollection<HelpArticle> HelpArticles { get; set; } = new List<HelpArticle>();
    public ICollection<ContactMessage> ContactMessages { get; set; } = new List<ContactMessage>();
    public ICollection<Note> Notes { get; set; } = new List<Note>();
    public ICollection<UserActivity> UserActivities { get; set; } = new List<UserActivity>();
  }

}
