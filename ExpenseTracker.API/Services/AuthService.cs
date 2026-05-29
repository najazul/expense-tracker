using ExpenseTracker.API.Interfaces;
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
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();

        // 1. Validate the Google ID token
        var googleClientId = _config["GoogleAuth:ClientId"];
        var settings = new GoogleJsonWebSignature.ValidationSettings
        {
            Audience = new[] { googleClientId }
        };

        Console.WriteLine("[Auth] Starting Google Token validation...");
        var payload = await GoogleJsonWebSignature.ValidateAsync(googleIdToken, settings);
        Console.WriteLine($"[Auth] Google Token validation complete. Took {stopwatch.ElapsedMilliseconds}ms");
        stopwatch.Restart();

        // 2. Find or create the user in Database
        Console.WriteLine("[Auth] Finding user in DB...");
        var user = await _db.Users.FirstOrDefaultAsync(u => u.GoogleId == payload.Subject);
        Console.WriteLine($"[Auth] DB Query complete. Took {stopwatch.ElapsedMilliseconds}ms");
        stopwatch.Restart();

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

        Console.WriteLine("[Auth] Saving user to DB...");
        await _db.SaveChangesAsync();
        Console.WriteLine($"[Auth] DB SaveChangesAsync complete. Took {stopwatch.ElapsedMilliseconds}ms");
        stopwatch.Stop();

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

