using DevoBackend.Models;
using DevoBackend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace DevoBackend.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class NotesController : ControllerBase
	{
		private readonly DevoDbContext _context;

		public NotesController(DevoDbContext context)
		{
			_context = context;
		}

		// GET: api/notes
		[HttpGet]
		public async Task<IActionResult> GetNotes()
		{
			var notes = await _context.Notes.OrderByDescending(n => n.CreatedAt).ToListAsync();
			return Ok(notes);
		}

		// GET: api/notes/5
		[HttpGet("{id}")]
		public async Task<IActionResult> GetNoteById(int id)
		{
			var note = await _context.Notes.FindAsync(id);
			if (note == null)
				return NotFound();

			return Ok(note);
		}

		// POST: api/notes
		[HttpPost]
		public async Task<IActionResult> CreateNote([FromBody] EmployeeNote note)
		{
			if (string.IsNullOrWhiteSpace(note.Title))
				return BadRequest("Title is required.");

			_context.Notes.Add(note);
			await _context.SaveChangesAsync();

			return Ok(note);
		}

		// PUT: api/notes/5
		[HttpPut("{id}")]
		public async Task<IActionResult> UpdateNote(int id, [FromBody] EmployeeNote updatedNote)
		{
			var note = await _context.Notes.FindAsync(id);

			if (note == null)
				return NotFound();

			note.Title = updatedNote.Title;
			note.Content = updatedNote.Content;
			note.UpdatedAt = DateTime.UtcNow;

			await _context.SaveChangesAsync();

			return Ok(note);
		}

		// DELETE: api/notes/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteNote(int id)
		{
			var note = await _context.Notes.FindAsync(id);
			if (note == null)
				return NotFound();

			_context.Notes.Remove(note);
			await _context.SaveChangesAsync();

			return Ok(new { message = "Note deleted successfully" });
		}
	}
}