using Microsoft.AspNetCore.Http;

namespace ExpenseTracker.API.Dtos;

public class ExpenseCreateRequest
{
    public decimal Amount { get; set; }
    public string? Description { get; set; }
    public IFormFile? ReceiptPhoto { get; set; }
    public DateTime? ExpenseDate { get; set; }
}
