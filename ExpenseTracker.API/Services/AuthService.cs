using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ExpenseTracker.API.Data;
using ExpenseTracker.API.Models;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace ExpenseTracker.API.Services;

public class AuthService : IAuthService
{
    private readonly ExpenseDbContext _db;
    private readonly IConfiguration _config;

    public AuthService(ExpenseDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    public async Task<(User user, string token)> AuthenticateWithGoogleAsync(string googleIdToken)
    {
        // Validate the Google ID token
        var googleClientId = _config["GoogleAuth:ClientId"];
        var settings = new GoogleJsonWebSignature.ValidationSettings
        {
            Audience = new[] { googleClientId }
        };

        var payload = await GoogleJsonWebSignature.ValidateAsync(googleIdToken, settings);

        // Find or create the user
        var user = await _db.Users.FirstOrDefaultAsync(u => u.GoogleId == payload.Subject);

        if (user is null)
        {
            user = new User
            {
                Id = Guid.NewGuid(),
                GoogleId = payload.Subject,
                Email = payload.Email,
                Name = payload.Name,
                PictureUrl = payload.Picture,
                CreatedAt = DateTime.UtcNow,
                LastLoginAt = DateTime.UtcNow
            };
            _db.Users.Add(user);
        }
        else
        {
            user.LastLoginAt = DateTime.UtcNow;
            user.Name = payload.Name;
            user.PictureUrl = payload.Picture;
        }

        await _db.SaveChangesAsync();

        // Generate JWT
        var token = GenerateJwt(user);

        return (user, token);
    }

    private string GenerateJwt(User user)
    {
        var secretKey = _config["Jwt:SecretKey"]!;
        var issuer = _config["Jwt:Issuer"];
        var audience = _config["Jwt:Audience"];
        var expiryDays = int.Parse(_config["Jwt:ExpiryDays"] ?? "7");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name ?? ""),
            new Claim("picture", user.PictureUrl ?? "")
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(expiryDays),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
