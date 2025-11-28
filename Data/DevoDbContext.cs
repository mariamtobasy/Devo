using DevoBackend.Data;
using Microsoft.EntityFrameworkCore;
using DevoBackend.Models;

namespace DevoBackend.Data
{
    public class DevoDbContext : DbContext
    {
        public DevoDbContext(DbContextOptions<DevoDbContext> options)
            : base(options)
        {

        }
        // DbSets for all tables
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Team> Teams { get; set; } = null!;
        public DbSet<TeamMember> TeamMembers { get; set; } = null!;
        public DbSet<AssignedTask> Tasks { get; set; } = null!;
        public DbSet<TaskComment> TaskComments { get; set; } = null!;
        public DbSet<TaskHistory> TaskHistories { get; set; } = null!;
        public DbSet<Meeting> Meetings { get; set; } = null!;
        public DbSet<MeetingParticipant> MeetingParticipants { get; set; } = null!;
        public DbSet<Notification> Notifications { get; set; } = null!;
        public DbSet<HelpArticle> HelpArticles { get; set; } = null!;
        public DbSet<ContactMessage> ContactMessages { get; set; } = null!;
        public DbSet<Note> Notes { get; set; } = null!;
        public DbSet<UserActivity> UserActivities { get; set; } = null!;


    /*2️⃣ Optional fields
Fields like:
Organization
ReportsTo
Department
are only useful if you want to:
Return them to Angular after login (e.g., show the department in the dashboard).
Use them in role-based logic (e.g., managers see different things than employees).
If your Angular login page just needs token + basic user info (like UserId, FullName, Email, Role), you can safely ignore these extra fields for now.*/


    protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ========================
            // TeamMembers composite key
            // ========================
            modelBuilder.Entity<TeamMember>()
                .HasKey(tm => new { tm.TeamId, tm.UserId });

            modelBuilder.Entity<TeamMember>()
                .HasOne(tm => tm.Team)
                .WithMany(t => t.Members)
                .HasForeignKey(tm => tm.TeamId);

            modelBuilder.Entity<TeamMember>()
                .HasOne(tm => tm.User)
                .WithMany(u => u.TeamMemberships)
                .HasForeignKey(tm => tm.UserId);

            // ========================
            // MeetingParticipants composite key
            // ========================
            modelBuilder.Entity<MeetingParticipant>()
                .HasKey(mp => new { mp.MeetingId, mp.UserId });

            modelBuilder.Entity<MeetingParticipant>()
                .HasOne(mp => mp.Meeting)
                .WithMany(m => m.Participants)
                .HasForeignKey(mp => mp.MeetingId);

            modelBuilder.Entity<MeetingParticipant>()
                .HasOne(mp => mp.User)
                .WithMany(u => u.MeetingParticipations)
                .HasForeignKey(mp => mp.UserId);

            // ========================
            // Task relationships
            // ========================
            modelBuilder.Entity<AssignedTask>()
                .HasOne(t => t.Assignee)
                .WithMany(u => u.AssignedTasks)
                .HasForeignKey(t => t.AssignedTo)
                .OnDelete(DeleteBehavior.SetNull); // optional

            modelBuilder.Entity<AssignedTask>()
                .HasOne(t => t.Creator)
                .WithMany(u => u.CreatedTasks)
                .HasForeignKey(t => t.CreatedBy)
                .OnDelete(DeleteBehavior.SetNull);

            // ========================
            // TaskComments
            // ========================
            modelBuilder.Entity<TaskComment>()
                .HasOne(tc => tc.Task)
                .WithMany(t => t.Comments)
                .HasForeignKey(tc => tc.TaskId);

            modelBuilder.Entity<TaskComment>()
                .HasOne(tc => tc.User)
                .WithMany(u => u.TaskComments)
                .HasForeignKey(tc => tc.UserId);

            // ========================
            // TaskHistory
            // ========================
            modelBuilder.Entity<TaskHistory>()
                .HasOne(th => th.Task)
                .WithMany(t => t.Histories)
                .HasForeignKey(th => th.TaskId);

            modelBuilder.Entity<TaskHistory>()
                .HasOne(th => th.User)
                .WithMany(u => u.TaskHistories)
                .HasForeignKey(th => th.PerformedBy);

            // ========================
            // Meetings
            // ========================
            modelBuilder.Entity<Meeting>()
                .HasOne(m => m.Creator)
                .WithMany(u => u.CreatedMeetings)
                .HasForeignKey(m => m.CreatedBy);

            // ========================
            // Notifications
            // ========================
            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(n => n.UserId);

            // ========================
            // HelpArticles
            // ========================
            modelBuilder.Entity<HelpArticle>()
                .HasOne(h => h.Creator)
                .WithMany(u => u.HelpArticles)
                .HasForeignKey(h => h.CreatedBy);

            // ========================
            // ContactMessages
            // ========================
            modelBuilder.Entity<ContactMessage>()
                .HasOne(c => c.User)
                .WithMany(u => u.ContactMessages)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            // ========================
            // Notes
            // ========================
            modelBuilder.Entity<Note>()
                .HasOne(n => n.User)
                .WithMany(u => u.Notes)
                .HasForeignKey(n => n.UserId);

            // ========================
            // UserActivity
            // ========================
            modelBuilder.Entity<UserActivity>()
                .HasOne(ua => ua.User)
                .WithMany(u => u.UserActivities)
                .HasForeignKey(ua => ua.UserId);

            modelBuilder.Entity<UserActivity>()
                .HasOne(ua => ua.Task)
                .WithMany(t => t.UserActivities)
                .HasForeignKey(ua => ua.RelatedTaskId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<UserActivity>()
                .HasOne(ua => ua.Meeting)
                .WithMany(m => m.UserActivities)
                .HasForeignKey(ua => ua.RelatedMeetingId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }

}
