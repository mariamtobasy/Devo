using DevoBackend.Models;
using DevoBackend.Data;
using DevoBackend.Hubs; // FIX: Ensure this matches your SignalR Hub namespace
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace DevoBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamsController : ControllerBase
    {
        private readonly DevoDbContext _context;
        // FIX: Use the specific IHubContext interface instead of 'object'
        private readonly IHubContext<TeamsHub> _hubContext;

        // FIX: Inject BOTH the DB Context and the Hub Context in the constructor
        public TeamsController(DevoDbContext context, IHubContext<TeamsHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        // ------------------------
        //  TEAM CRUD
        // ------------------------
        [HttpGet]
        public async Task<IActionResult> GetAllTeams()
        {
            // FIX: Add Include statements so Members and Tasks are sent to Angular
            var teams = await _context.Teams
                .Include(t => t.Members)
                .Include(t => t.Tasks)
                .Include(t => t.ChatMessages)
                .ToListAsync();

            return Ok(teams);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTeam([FromBody] Team team)
        {
            _context.Teams.Add(team);
            await _context.SaveChangesAsync();
            return Ok(team);
        }

        [HttpGet("{teamId}")]
        public async Task<IActionResult> GetTeam(int teamId)
        {
            var team = await _context.Teams
                .Include(t => t.Members)
                .Include(t => t.Tasks)
                .FirstOrDefaultAsync(t => t.Id == teamId);

            if (team == null) return NotFound();

            var result = new
            {
                team.Id,
                team.Name,
                team.Description,
                team.CreatedAt,
                Members = team.Members.ToList(),
                Tasks = team.Tasks.ToList()
            };

            return Ok(result);
        }

        [HttpDelete("{teamId}")]
        public async Task<IActionResult> DeleteTeam(int teamId)
        {
            var team = await _context.Teams.FindAsync(teamId);
            if (team == null) return NotFound();
            _context.Teams.Remove(team);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // ------------------------
        //  MEMBERS (FIXED DELETE)
        // ------------------------
        [HttpPost("{teamId}/members")]
        public async Task<IActionResult> AddMember(int teamId, TeamMember m)
        {
            var teamExists = await _context.Teams.AnyAsync(t => t.Id == teamId);
            if (!teamExists) return BadRequest("Team does not exist");

            m.TeamId = teamId;
            _context.TeamMembers.Add(m);
            await _context.SaveChangesAsync();

            // Notify the user they were added
            await _hubContext.Clients.User(m.UserId.ToString()).SendAsync("AddedToTeam", teamId);

            return Ok(m);
        }


        // ------------------------
        //  TASKS (FIXED DELETE)
        // ------------------------
        [HttpPost("{teamId}/tasks")]
        public async Task<IActionResult> CreateTask(int teamId, [FromBody] TeamTask task)
        {
            task.TeamId = teamId;
            _context.TeamTasks.Add(task);
            await _context.SaveChangesAsync();

            // Real-time notify team
            await _hubContext.Clients.Group($"Team_{teamId}").SendAsync("TaskCreated", task);
            return Ok(task);
        }


        // ------------------------
        //  CHAT (FIXED DELETE)
        // ------------------------
        [HttpPost("{teamId}/chat")]
        public async Task<IActionResult> SendChatMessage(int teamId, [FromBody] TeamMessage msg)
        {
            msg.TeamId = teamId;
            _context.TeamMessages.Add(msg);
            await _context.SaveChangesAsync();

            // Broadcast the WHOLE object so the Store can unwrap it properly
            // Ensure the group name "Team_1051" matches your Hub exactly
            await _hubContext.Clients.Group($"Team_{teamId}").SendAsync("ReceiveMessage", msg);

            return Ok(msg);
        }



        // --- DELETE MEMBER ---
        // Your error was: api/teams/1050/members/1 (where 1 is UserId)
        [HttpDelete("{teamId}/members/{userId}")]
        public async Task<IActionResult> DeleteMember(int teamId, int userId)
        {
            // Search by the UserId within that specific team
            var membership = await _context.TeamMembers
                .FirstOrDefaultAsync(m => m.TeamId == teamId && m.UserId == userId);

            if (membership == null) return NotFound();

            _context.TeamMembers.Remove(membership);
            await _context.SaveChangesAsync();

            // Notify the user they were removed and the team group
            await _hubContext.Clients.User(userId.ToString()).SendAsync("RemovedFromTeam", teamId);
            await _hubContext.Clients.Group($"Team_{teamId}").SendAsync("MemberRemoved", userId);

            return Ok();
        }

        // --- DELETE TASK ---
        [HttpDelete("{teamId}/tasks/{taskId}")]
        public async Task<IActionResult> DeleteTask(int teamId, int taskId)
        {
            var task = await _context.TeamTasks.FirstOrDefaultAsync(t => t.Id == taskId && t.TeamId == teamId);

            if (task == null) return NotFound();

            _context.TeamTasks.Remove(task);
            await _context.SaveChangesAsync();

            await _hubContext.Clients.Group($"Team_{teamId}").SendAsync("TaskDeleted", taskId);
            return Ok();
        }

        // --- DELETE MESSAGE ---
        [HttpDelete("{teamId}/chat/{messageId}")]
        public async Task<IActionResult> DeleteMessage(int teamId, int messageId)
        {
            var msg = await _context.TeamMessages.FirstOrDefaultAsync(m => m.Id == messageId && m.TeamId == teamId);

            if (msg == null) return NotFound();

            _context.TeamMessages.Remove(msg);
            await _context.SaveChangesAsync();

            await _hubContext.Clients.Group($"Team_{teamId}").SendAsync("MessageDeleted", messageId);
            return NoContent();
        }
    }
}