using ExpenseTracker.API.Models;

namespace ExpenseTracker.API.Interfaces;

public interface IAuthService
{
    Task<(User user, string token)> AuthenticateWithGoogleAsync(string googleIdToken);
}

