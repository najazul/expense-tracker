using ExpenseTracker.API.Models;

namespace ExpenseTracker.API.Interfaces;

public interface IExpenseService
{
    Task<List<Expense>> GetAllAsync(Guid userId);
    Task<Expense?> GetByIdAsync(Guid id, Guid userId);
    Task<Expense> CreateAsync(Expense input, Guid userId);
    Task<bool> UpdateAsync(Expense input, Guid userId);
    Task<bool> DeleteAsync(Guid id, Guid userId);
}

