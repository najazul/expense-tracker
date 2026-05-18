namespace ExpenseTracker.API.Dtos;

public class AuthResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public UserResponse User { get; set; } = null!;
}

public class UserResponse
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? Name { get; set; }
    public string? PictureUrl { get; set; }
}
