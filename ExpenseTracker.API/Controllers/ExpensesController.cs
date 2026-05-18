using ExpenseTracker.API.Dtos;
using ExpenseTracker.API.Models;
using ExpenseTracker.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ExpenseTracker.API.Controllers;

[Authorize]
[ApiController]
[Route("api/expenses")]
public class ExpensesController : ControllerBase
{
    private readonly IExpenseService _service;
    private readonly IStorageService _storageService;

    public ExpensesController(IExpenseService service, IStorageService storageService)
    {
        _service = service;
        _storageService = storageService;
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<ActionResult<List<ExpenseResponse>>> GetAll()
    {
        var items = await _service.GetAllAsync(GetUserId());
        var response = items.Select(MapToResponse).ToList();
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ExpenseResponse>> GetById(Guid id)
    {
        var expense = await _service.GetByIdAsync(id, GetUserId());
        if (expense is null)
        {
            return NotFound();
        }

        return Ok(MapToResponse(expense));
    }

    [HttpPost]
    public async Task<ActionResult<ExpenseResponse>> Create([FromForm] ExpenseCreateRequest request)
    {
        string? photoUrl = null;
        if (request.ReceiptPhoto != null)
        {
            photoUrl = await _storageService.UploadFileAsync(request.ReceiptPhoto);
        }

        var expense = new Expense
        {
            Amount = request.Amount,
            Description = request.Description,
            PhotoUrl = photoUrl,
            ExpenseDate = request.ExpenseDate ?? default
        };

        var created = await _service.CreateAsync(expense, GetUserId());
        var response = MapToResponse(created);

        return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromForm] ExpenseUpdateRequest request)
    {
        var existing = await _service.GetByIdAsync(id, GetUserId());
        if (existing == null) return NotFound();

        string? photoUrl = existing.PhotoUrl;
        if (request.ReceiptPhoto != null)
        {
            // Upload new photo and delete old one
            photoUrl = await _storageService.UploadFileAsync(request.ReceiptPhoto);
            if (!string.IsNullOrEmpty(existing.PhotoUrl))
            {
                await _storageService.DeleteFileAsync(existing.PhotoUrl);
            }
        }

        existing.Amount = request.Amount;
        existing.Description = request.Description;
        existing.PhotoUrl = photoUrl;
        existing.ExpenseDate = request.ExpenseDate;

        var updated = await _service.UpdateAsync(existing, GetUserId());
        if (!updated)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var existing = await _service.GetByIdAsync(id, GetUserId());
        if (existing == null) return NotFound();

        var deleted = await _service.DeleteAsync(id, GetUserId());
        if (deleted && !string.IsNullOrEmpty(existing.PhotoUrl))
        {
            await _storageService.DeleteFileAsync(existing.PhotoUrl);
        }

        return NoContent();
    }

    private static ExpenseResponse MapToResponse(Expense expense)
    {
        return new ExpenseResponse
        {
            Id = expense.Id,
            Amount = expense.Amount,
            Description = expense.Description,
            PhotoUrl = expense.PhotoUrl,
            ExpenseDate = expense.ExpenseDate
        };
    }
}
