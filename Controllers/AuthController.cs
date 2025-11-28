using Microsoft.AspNetCore.Mvc;
using DevoBackend.Data;
using DevoBackend.Models;
using DevoBackend.Models.DTOs;
using System.Security.Cryptography;
using System.Text;
using DevoBackend.Services;
using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore; // for FirstOrDefaultAsync

namespace DevoBackend.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AuthController : ControllerBase
  {
    private readonly DevoDbContext _context;
    private readonly JwtService _jwtService; // <-- add this field

    public AuthController(DevoDbContext context, JwtService jwtService)
    {
      _context = context;
      _jwtService = jwtService; // <-- assign it here
    }

    [HttpPost("register")]
    [Produces("application/json")]
    public async Task<IActionResult> Register([FromBody] User request)
    {
      // 1️⃣ Validate required fields
      if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.PasswordHash))
      {
        return BadRequest(new { message = "Email and password are required." });
      }

      // 2️⃣ Check if email already exists
      var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
      if (existingUser != null)
      {
        return BadRequest(new { message = "Email already registered." });
      }

      // 3️⃣ Set default role if not provided
      if (string.IsNullOrEmpty(request.Role))
      {
        request.Role = "Employee";
      }

      // 4️⃣ Hash the password
      var hashedPassword = HashPassword(request.PasswordHash);

      // 5️⃣ Create User object
      var user = new User
      {
        FullName = request.FullName,
        Email = request.Email,
        PasswordHash = HashPassword(request.PasswordHash),
        JobTitle = request.JobTitle,
        PhoneNumber = request.PhoneNumber,
        Location = request.Location,
        Role = request.Role,
        DepartmentId = request.DepartmentId,
        ProfilePhoto = request.ProfilePhoto,
        ReportsTo = request.ReportsTo,        // new field
        Organization = request.Organization   // new field
      };


      // 6️⃣ Save to database
      _context.Users.Add(user);
      await _context.SaveChangesAsync();

      return new JsonResult(new { message = $"{user.Role} registered successfully!" });
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto request)
    {
      if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.PasswordHash))
        return BadRequest(new { message = "Email and password are required." });

      // Hash entered password
      var hashedPassword = HashPassword(request.PasswordHash);

      var user = await _context.Users
          .FirstOrDefaultAsync(u => u.Email == request.Email && u.PasswordHash == hashedPassword);

      if (user == null)
        return Unauthorized(new { message = "Invalid email or password." });

      // Generate token
      var tokenString = _jwtService.GenerateToken(user);

      return Ok(new
      {
        success = true,
        message = "Login successful",
        token = tokenString,
        user = new
        {
          user.UserId,
          user.FullName,
          user.Email,
          user.Role
        }
      });
    }


    private string HashPassword(string password)
    {
      using (var sha256 = SHA256.Create())
      {
        var bytes = Encoding.UTF8.GetBytes(password);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
      }
    }
  }
}

