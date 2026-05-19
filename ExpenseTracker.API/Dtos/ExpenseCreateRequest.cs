using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace ExpenseTracker.API.Dtos;

public class ExpenseCreateRequest
{
    public decimal Amount { get; set; }
    public string Description { get; set; } = null!;
    public IFormFile? ReceiptPhoto { get; set; }
    public DateTime ExpenseDate { get; set; }
}
