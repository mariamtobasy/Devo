using DevoBackend.Data;
using Microsoft.EntityFrameworkCore;
using DevoBackend.Models;
using DevoBackend.Controllers;

namespace DevoBackend.Data
{
    public class DevoDbContext : DbContext
    {
        public DevoDbContext(DbContextOptions<DevoDbContext> options)
            : base(options)
        {

        }
        // DbSets for all tables
        public DbSet<User> Users { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }
        public DbSet<MyListTask> MyListTasks { get; set; }
        public DbSet<AssignedTask> AssignedTasks { get; set; }
        public DbSet<TaskHistory> TaskHistories { get; set; }
        public DbSet<CalendarEvent> CalendarEvents { get; set; }
        public DbSet<EmployeeNote> Notes { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<TeamMember> TeamMembers { get; set; }
        public DbSet<TeamTask> TeamTasks { get; set; }
        public DbSet<TeamActivity> TeamActivities { get; set; }  // optional
        public DbSet<TeamMessage> TeamMessages { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Table mapping
            modelBuilder.Entity<Team>().ToTable("Teams");
            modelBuilder.Entity<TeamMember>().ToTable("TeamMembers");
            modelBuilder.Entity<TeamTask>().ToTable("TeamTasks");
            modelBuilder.Entity<TeamActivity>().ToTable("TeamActivities");
            modelBuilder.Entity<TeamMessage>().ToTable("TeamMessages");

            // Indexes
            modelBuilder.Entity<TeamMember>().HasIndex(tm => new { tm.TeamId, tm.UserId });
            modelBuilder.Entity<TeamTask>().HasIndex(tt => tt.TeamId);
            modelBuilder.Entity<TeamMessage>().HasIndex(m => m.TeamId);

            // Relationships + Cascade deletes
            modelBuilder.Entity<TaskHistory>()
                .HasOne(th => th.MyListTask)
                .WithMany(t => t.Histories)
                .HasForeignKey(th => th.MyListTaskId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TeamMember>()
                .HasOne(tm => tm.Team)
                .WithMany(t => t.Members)
                .HasForeignKey(tm => tm.TeamId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TeamTask>()
                .HasOne(tt => tt.Team)
                .WithMany(t => t.Tasks)
                .HasForeignKey(tt => tt.TeamId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TeamMessage>()
                .HasOne(tm => tm.Team)
                .WithMany(t => t.ChatMessages)
                .HasForeignKey(tm => tm.TeamId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
    }





