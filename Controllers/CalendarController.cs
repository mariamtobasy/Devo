using DevoBackend.Controllers;
using DevoBackend.Models;
using DevoBackend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DevoBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CalendarController : ControllerBase
    {
        private readonly DevoDbContext _context;

        // Inject DbContext through constructor
        public CalendarController(DevoDbContext context)
        {
            _context = context;
        }

        // GET: api/calendar
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CalendarEvent>>> GetEvents()
        {
            var events = await _context.CalendarEvents.ToListAsync();
            return events.Select(e => new CalendarEvent
            {
                Id = e.Id,
                Title = e.Title,
                Start = e.Start,
                End = e.End,
                VideoCallLink = e.VideoCallLink,
                Notes = e.Notes
            }).ToList();
        }

        // POST: api/calendar
        [HttpPost]
        public async Task<ActionResult<CalendarEvent>> AddEvent([FromBody] CalendarEvent dto)
        {
            var newEvent = new CalendarEvent
            {
                Title = dto.Title,
                Start = dto.Start,
                End = dto.End,
                VideoCallLink = dto.VideoCallLink,
                Notes = dto.Notes
            };

            _context.CalendarEvents.Add(newEvent);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEvents), new { id = newEvent.Id }, newEvent);
        }

        // DELETE: api/calendar/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var ev = await _context.CalendarEvents.FindAsync(id);
            if (ev == null)
            {
                return NotFound();
            }

            _context.CalendarEvents.Remove(ev);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}