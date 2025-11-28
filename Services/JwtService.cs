using DevoBackend.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


/*LocalStorage is in the browser, not the database.
Purpose: to store the JWT token from the backend after login.
Example:
localStorage.setItem('token', response.token);
The token is used for authenticated requests — Angular sends it with HTTP requests via the interceptor.
This has nothing to do with your backend database — it’s just a temporary storage in the user’s browser.*/

namespace DevoBackend.Services
{
  public class JwtService
  {
    private readonly string _secretKey;
    private readonly string _issuer;
    private readonly string _audience;

    public JwtService(IConfiguration configuration)
    {
      _secretKey = configuration["Jwt:Key"] ?? "abc123def456ghi789jkl012mno345pqr";
      _issuer = configuration["Jwt:Issuer"] ?? "DevoApp";
      _audience = configuration["Jwt:Audience"] ?? "DevoUsers";
    }

    public string GenerateToken(User user, double expiresInHours = 2)
    {
      if (user == null)
        throw new ArgumentNullException(nameof(user));

      var key = Encoding.UTF8.GetBytes(_secretKey);
      var tokenHandler = new JwtSecurityTokenHandler();

      var claims = new[]
      {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                new Claim(ClaimTypes.Role, user.Role ?? "User"),
                new Claim(ClaimTypes.Name, user.FullName ?? string.Empty)
            };

      var tokenDescriptor = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(claims),
        Expires = DateTime.UtcNow.AddHours(expiresInHours),
        Issuer = _issuer,
        Audience = _audience,
        SigningCredentials = new SigningCredentials(
              new SymmetricSecurityKey(key),
              SecurityAlgorithms.HmacSha256Signature
          )
      };

      var token = tokenHandler.CreateToken(tokenDescriptor);
      return tokenHandler.WriteToken(token);
    }
  }
}
