using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DevoBackend.Data;
using DevoBackend.Models;
using DevoBackend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace DevoBackend.Controllers
{
    [ApiController]
    [Route("api/tasks")]
    public class TasksController : ControllerBase
    {
        private readonly DevoDbContext _context;

        public TasksController(DevoDbContext context)
        {
            _context = context;
        }

        // GET ALL TASKS
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetTasks()
        {
            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (userEmail == null) return Unauthorized();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
            if (user == null) return Unauthorized();

            // Get tasks created by or assigned to the user
            /*    var tasks = await _context.AssignedTasks
                    .Where(t => t.CreatedBy == user.UserId || t.AssignedTo == user.UserId)
                    .ToListAsync();*/

            var tasks = await _context.AssignedTasks
              .Where(t => t.CreatedBy == user.UserId || t.AssignedTo == user.UserId)
              .Select(t => new
              {
                  id = t.AssignedTaskId,
                  title = t.Title,
                  description = t.Description,
                  tags = t.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries),
                  status = t.Status,
                  assignedBy = _context.Users
                      .Where(u => u.UserId == t.CreatedBy)
                      .Select(u => u.Email)
                      .FirstOrDefault(),
                  assignedTo = _context.Users
                      .Where(u => u.UserId == t.AssignedTo)
                      .Select(u => u.Email)
                      .FirstOrDefault(),
                  createdAt = t.CreatedAt,
                  dueDate = t.DueDate
              })
              .ToListAsync();

            return Ok(tasks);
        }

        
        // CREATE TASK
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto dto)
        {

            if (dto.AssignedToEmail == null)
                return BadRequest(new { message = "AssignedToEmail is required" });

            var creatorEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (creatorEmail == null) return Unauthorized();

            var creator = await _context.Users.FirstOrDefaultAsync(u => u.Email == creatorEmail);
            if (creator == null) return Unauthorized();

            // Validate assignedTo email
            if (string.IsNullOrEmpty(dto.AssignedToEmail))
                return BadRequest(new { message = "AssignedToEmail is required" });

            var assignee = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.AssignedToEmail);
            if (assignee == null)
                return BadRequest(new { message = "Assigned user does not exist" });

            var task = new AssignedTask
            {
                Title = dto.Title,
                Description = dto.Description,
                Tags = string.Join(",", dto.Tags),
                Status = MapStatusToDb(dto.Status),
                CreatedBy = creator.UserId,
                AssignedTo = assignee.UserId,
                CreatedAt = DateTime.UtcNow,
                DueDate = dto.DueDate
            };

            _context.AssignedTasks.Add(task);
            await _context.SaveChangesAsync();

            _context.TaskHistories.Add(new TaskHistory
            {
                AssignedTaskId = task.AssignedTaskId,
                Action = "CREATED_ASSIGNED_TASK",
                PerformedBy = creator.UserId,
                Timestamp = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = task.AssignedTaskId,
                title = task.Title,
                description = task.Description,
                tags = task.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries),
                status = task.Status,
                assignedBy = creator.Email,
                assignedTo = assignee.Email,  // <-- this will now be Omar correctly
                createdAt = task.CreatedAt,
                dueDate = task.DueDate
            });
        }

        /*
                // ?? STATUS MAPPING GOES HERE
                private static string MapStatusToDb(string status)
                {
                    return status switch
                    {
                        "todo" => "Todo",
                        "in-progress" => "InProgress",
                        "review" => "Review",
                        "done" => "Done",
                        _ => "Todo"
                    };
                }*/

        // DTO for PATCH request
        public class UpdateStatusDto
        {
            public string NewStatus { get; set; } = null!;
        }

        // PATCH: /api/tasks/{id}/status
        [HttpPatch("{id}/status")]
        [Authorize]
        public async Task<IActionResult> UpdateTaskStatus(int id, [FromBody] UpdateStatusDto dto)
        {
            var newStatus = dto.NewStatus;

            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (userEmail == null) return Unauthorized();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
            if (user == null) return Unauthorized();

            var task = await _context.AssignedTasks.FindAsync(id);
            if (task == null) return NotFound();

            if (task.CreatedBy != user.UserId && task.AssignedTo != user.UserId)
                return Forbid();

            // Update status
            task.Status = MapStatusToDb(newStatus);

            _context.TaskHistories.Add(new TaskHistory
            {
                AssignedTaskId = task.AssignedTaskId,
                Action = $"UPDATED_STATUS_TO_{task.Status}",
                PerformedBy = user.UserId,
                Timestamp = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = task.AssignedTaskId,
                title = task.Title,
                description = task.Description,
                tags = task.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries),
                status = task.Status,
                assignedBy = _context.Users
                    .Where(u => u.UserId == task.CreatedBy)
                    .Select(u => u.Email)
                    .FirstOrDefault(),
                assignedTo = _context.Users
                    .Where(u => u.UserId == task.AssignedTo)
                    .Select(u => u.Email)
                    .FirstOrDefault(),
                createdAt = task.CreatedAt,
                dueDate = task.DueDate
            });
        }
        // Map frontend status to DB
        private static string MapStatusToDb(string status)
        {
            return status switch
            {
                "todo" => "Todo",
                "in-progress" => "InProgress",
                "review" => "Review",
                "done" => "Done",
                _ => "Todo"
            };
        }

        // OPTIONAL: you can add DELETE endpoint later
    }
}
    
