using ExpenseTracker.API.Interfaces;
using ExpenseTracker.API.Data;
using ExpenseTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.API.Services;

public class ExpenseService : IExpenseService
{
    private const string UntitledReceiptPrefix = "Untitled Receipt";
    private readonly ExpenseDbContext _db;

    public ExpenseService(ExpenseDbContext db)
    {
        _db = db;
    }

    public async Task<List<Expense>> GetAllAsync(Guid userId)
    {
        return await _db.Expenses.AsNoTracking()
            .Where(e => e.UserId == userId)
            .ToListAsync();
    }

    public async Task<Expense?> GetByIdAsync(Guid id, Guid userId)
    {
        return await _db.Expenses.AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);
    }

    public async Task<Expense> CreateAsync(Expense input, Guid userId)
    {
        if (input.Id == Guid.Empty)
        {
            input.Id = Guid.NewGuid();
        }

        input.UserId = userId;

        if (string.IsNullOrWhiteSpace(input.Description))
        {
            var nextNumber = await _db.Expenses.AsNoTracking()
                .Where(e => e.UserId == userId && e.Description != null && e.Description.StartsWith(UntitledReceiptPrefix))
                .CountAsync() + 1;
            input.Description = $"{UntitledReceiptPrefix} {nextNumber}";
        }

        _db.Expenses.Add(input);
        await _db.SaveChangesAsync();
        return input;
    }

    public async Task<bool> UpdateAsync(Expense input, Guid userId)
    {
        var existing = await _db.Expenses
            .FirstOrDefaultAsync(e => e.Id == input.Id && e.UserId == userId);

        if (existing is null)
        {
            return false;
        }

        existing.Amount = input.Amount;
        if (!string.IsNullOrWhiteSpace(input.Description))
        {
            existing.Description = input.Description;
        }
        existing.PhotoUrl = input.PhotoUrl;
        existing.ExpenseDate = input.ExpenseDate;

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, Guid userId)
    {
        var existing = await _db.Expenses
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

        if (existing is null)
        {
            return false;
        }

        _db.Expenses.Remove(existing);
        await _db.SaveChangesAsync();
        return true;
    }
}

