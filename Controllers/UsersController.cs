using DevoBackend.Models;
using DevoBackend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using DevoBackend.Models.DTOs;

namespace DevoBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly DevoDbContext _context;

        public UsersController(DevoDbContext context)
        {
            _context = context;
        }
        [HttpGet("profile")]
        [Authorize]
        public async Task<ActionResult<UserProfileDto>> GetProfile()
        {
            var userEmail = User.Identity.Name; // Comes from JWT token
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);

            if (user == null) return NotFound();

            var dto = new UserProfileDto
            {
                FullName = user.FullName,
                JobTitle = user.JobTitle,
                DepartmentId = user.DepartmentId,
                ReportsTo = user.ReportsTo,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Organization = user.Organization,
                Location = user.Location,
                ProfilePhoto = user.ProfilePhoto
            };

            return Ok(dto);
        }
        [HttpPut("update-account")]
        public async Task<IActionResult> UpdateAccount([FromBody] UpdateAccountDto request)
        {
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null) return NotFound(new { message = "User not found" });

            // you may want to validate email format and check uniqueness before updating
            user.Email = request.Email;
            user.FullName = request.FullName;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Account updated successfully" });
        }

        [HttpPost("update-preferences")]
        public async Task<IActionResult> UpdatePreferences([FromBody] UserPreferencesDto request)
        {
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null) return NotFound(new { message = "User not found" });

            // Example fields - update your user model fields accordingly
            user.CookiesAccepted = request.CookiesAccepted;
            user.TwoFactorEnabled = request.TwoFactorEnabled;
            user.Language = request.Language;
            user.TimeZone = request.TimeZone;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Preferences updated" });
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == request.UserId);
            if (user == null) 
                return NotFound(new { message = "User not found" });

            // FIX: Check if PasswordHash exists before verifying
            if (string.IsNullOrEmpty(user.PasswordHash))
            {
                return BadRequest(new { message = "User has no password set in database." });
            }

            /*  if (!BCrypt.Net.BCrypt.Verify(request.OldPassword, user.PasswordHash))
              {
                  return BadRequest(new { message = "Old password is incorrect" });
              }
              // Update password
              user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);*/

            //  SHA256 check (MATCHES LOGIN)
            if (HashPassword(request.OldPassword) != user.PasswordHash)
                return BadRequest(new { message = "Old password is incorrect" });

            // Update password
            user.PasswordHash = HashPassword(request.NewPassword);


            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password updated successfully" });
        }

        [HttpGet("set")]
        public IActionResult SetCookie()
        {
            var cookieOptions = new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddDays(7),
                HttpOnly = true,  // secure from JS access
                SameSite = SameSiteMode.Strict,
                Secure = true     // use HTTPS
            };
            Response.Cookies.Append("username", "Hala", cookieOptions);
            return Ok("Cookie set!");
        }

        [HttpGet("get")]
        public IActionResult GetCookie()
        {
            var username = Request.Cookies["username"];
            return Ok($"Username from cookie: {username}");
        }

        [HttpGet("delete")]
        public IActionResult DeleteCookie()
        {
            Response.Cookies.Delete("username");
            return Ok("Cookie deleted!");
        }

        [HttpPost("savePreferences")]
        public IActionResult SavePreferences([FromBody] UserPreferences prefs)
        {
            // prefs.Username and prefs.Theme come from the frontend
            Response.Cookies.Append("username", prefs.FullName, new CookieOptions { Expires = DateTimeOffset.UtcNow.AddDays(7) });
            Response.Cookies.Append("theme", prefs.Theme, new CookieOptions { Expires = DateTimeOffset.UtcNow.AddDays(7) });
            return Ok("Preferences saved!");
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            return Convert.ToBase64String(sha256.ComputeHash(bytes));
        }

    }
}