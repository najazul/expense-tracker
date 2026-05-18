using ExpenseTracker.API.Models;

namespace ExpenseTracker.API.Services;

public interface IAuthService
{
    Task<(User user, string token)> AuthenticateWithGoogleAsync(string googleIdToken);
}
