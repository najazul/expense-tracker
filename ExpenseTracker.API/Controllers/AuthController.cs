using ExpenseTracker.API.Dtos;
using ExpenseTracker.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("google")]
    public async Task<ActionResult<AuthResponse>> GoogleLogin([FromBody] GoogleLoginRequest request)
    {
        try
        {
            var (user, token) = await _authService.AuthenticateWithGoogleAsync(request.IdToken);

            var response = new AuthResponse
            {
                AccessToken = token,
                User = new UserResponse
                {
                    Id = user.Id,
                    Email = user.Email,
                    Name = user.Name,
                    PictureUrl = user.PictureUrl
                }
            };

            return Ok(response);
        }
        catch (Exception)
        {
            return Unauthorized(new { message = "Invalid Google token" });
        }
    }
}
