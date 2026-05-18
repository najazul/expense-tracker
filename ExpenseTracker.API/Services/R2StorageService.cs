using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Http;

namespace ExpenseTracker.API.Services;

public class R2StorageService : IStorageService
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;
    private readonly string _publicDomain;

    public R2StorageService(IAmazonS3 s3Client, IConfiguration config)
    {
        _s3Client = s3Client;
        _bucketName = config["CloudflareR2:BucketName"] ?? throw new ArgumentNullException("CloudflareR2:BucketName");
        _publicDomain = config["CloudflareR2:PublicDomain"] ?? throw new ArgumentNullException("CloudflareR2:PublicDomain");
    }

    public async Task<string> UploadFileAsync(IFormFile file)
    {
        if (file.Length == 0) return string.Empty;

        // Generate a unique filename while preserving the extension
        var extension = Path.GetExtension(file.FileName);
        var uniqueFileName = $"{Guid.NewGuid()}{extension}";

        using var newMemoryStream = new MemoryStream();
        await file.CopyToAsync(newMemoryStream);
        newMemoryStream.Position = 0;

        var putRequest = new PutObjectRequest
        {
            InputStream = newMemoryStream,
            BucketName = _bucketName,
            Key = uniqueFileName,
            ContentType = file.ContentType,
            DisablePayloadSigning = true
        };

        await _s3Client.PutObjectAsync(putRequest);

        // Return the public URL
        return $"{_publicDomain.TrimEnd('/')}/{uniqueFileName}";
    }

    public async Task DeleteFileAsync(string fileUrl)
    {
        if (string.IsNullOrWhiteSpace(fileUrl) || !fileUrl.StartsWith(_publicDomain))
            return;

        var key = fileUrl.Substring(_publicDomain.Length).TrimStart('/');

        var deleteRequest = new DeleteObjectRequest
        {
            BucketName = _bucketName,
            Key = key
        };

        await _s3Client.DeleteObjectAsync(deleteRequest);
    }
}
