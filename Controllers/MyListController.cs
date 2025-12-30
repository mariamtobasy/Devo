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
    [Route("api/mylist")]
    [Authorize]
    public class MyListController : ControllerBase
    {
        private readonly DevoDbContext _context;

        public MyListController(DevoDbContext context)
        {
            _context = context;
        }

        // GET: /api/mylist
        [HttpGet]
        public async Task<IActionResult> GetMyList()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var tasks = await _context.MyListTasks
                                      .Where(t => t.UserId == userId)
                                      .OrderByDescending(t => t.CreatedAt)
                                      .ToListAsync();
            return Ok(tasks);
        }

        // POST: /api/mylist
        [HttpPost]
        public async Task<IActionResult> CreateMyListTask([FromBody] CreateMyListTaskDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            var userId = int.Parse(userIdClaim.Value);


            var task = new MyListTask
            {
                Title = dto.Title,
                Description = dto.Description,
                Priority = dto.Priority,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.MyListTasks.Add(task);
            await _context.SaveChangesAsync();

            // Log history
            _context.TaskHistories.Add(new TaskHistory
            {
                MyListTaskId = task.MyListTaskId,
                Action = "CREATED_MYLIST_TASK",
                PerformedBy = userId,
                Timestamp = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();

            return Ok(task);
        }
        
        // PUT: /api/mylist/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMyListTask(int id, [FromBody] CreateMyListTaskDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var task = await _context.MyListTasks.FindAsync(id);
            if (task == null || task.UserId != userId) return NotFound();

            if (!string.IsNullOrEmpty(dto.Title)) task.Title = dto.Title;
            if (dto.Description != null) task.Description = dto.Description;
            if (!string.IsNullOrEmpty(dto.Priority)) task.Priority = dto.Priority;
            if (dto.IsCompleted.HasValue) task.IsCompleted = dto.IsCompleted.Value;

         

            // Log history
            _context.TaskHistories.Add(new TaskHistory
            {
                MyListTaskId = task.MyListTaskId,
                Action = "UPDATED_MYLIST_TASK",
                PerformedBy = userId,
                Timestamp = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();

            return Ok(task);
        }

        // DELETE: /api/mylist/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMyListTask(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var task = await _context.MyListTasks.FindAsync(id);
            if (task == null || task.UserId != userId) return NotFound();

           
           


            // Log history
            _context.TaskHistories.Add(new TaskHistory
            {
                MyListTaskId = task.MyListTaskId,
                Action = "DELETED_MYLIST_TASK",
                PerformedBy = userId,
                Timestamp = DateTime.UtcNow
            });

            _context.MyListTasks.Remove(task);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Task deleted successfully" });
        }
    }
}
