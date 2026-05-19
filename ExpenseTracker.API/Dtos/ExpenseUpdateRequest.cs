using Microsoft.AspNetCore.Http;

namespace ExpenseTracker.API.Dtos;

public class ExpenseUpdateRequest
{
    public decimal Amount { get; set; }
    public string Description { get; set; } = null!;
    public IFormFile? ReceiptPhoto { get; set; }
    public DateTime ExpenseDate { get; set; }
}
