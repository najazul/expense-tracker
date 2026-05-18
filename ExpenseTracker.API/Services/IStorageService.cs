using Microsoft.AspNetCore.Http;

namespace ExpenseTracker.API.Services;

public interface IStorageService
{
    Task<string> UploadFileAsync(IFormFile file);
    Task DeleteFileAsync(string fileUrl);
}
