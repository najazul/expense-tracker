namespace ExpenseTracker.API.Models;

public class Expense
{
    public Guid Id { get; set; }
    public Guid? UserId { get; set; }
    public decimal Amount { get; set; }
    public string? Description { get; set; }
    public string? PhotoUrl { get; set; }
    public DateTime ExpenseDate { get; set; }

    public User? User { get; set; }
}
