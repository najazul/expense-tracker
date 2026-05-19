namespace ExpenseTracker.API.Dtos;

public class ExpenseResponse
{
    public Guid Id { get; set; }
    public decimal Amount { get; set; }
    public string Description { get; set; } = null!;
    public string? PhotoUrl { get; set; }
    public DateTime ExpenseDate { get; set; }
}
