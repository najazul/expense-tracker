using System.Text;
using Amazon.S3;
using ExpenseTracker.API.Data;
using ExpenseTracker.API.Services;
using ExpenseTracker.API.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// JWT Authentication
var jwtConfig = builder.Configuration.GetSection("Jwt");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtConfig["Issuer"],
            ValidAudience = jwtConfig["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtConfig["SecretKey"]!))
        };
    });
builder.Services.AddAuthorization();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ExpenseDbContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddScoped<IExpenseService, ExpenseService>();
builder.Services.AddScoped<IAuthService, AuthService>();

var r2Config = builder.Configuration.GetSection("CloudflareR2");
var s3Config = new AmazonS3Config
{
    ServiceURL = r2Config["ServiceUrl"],
    ForcePathStyle = true
};
var s3Client = new AmazonS3Client(r2Config["AccessKey"], r2Config["SecretKey"], s3Config);
builder.Services.AddSingleton<IAmazonS3>(s3Client);
builder.Services.AddScoped<IStorageService, R2StorageService>();

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() 
    ?? throw new InvalidOperationException("CORS AllowedOrigins must be configured.");
// CORS for expense-tracker-web
builder.Services.AddCors(options =>
{   
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// Actual services the app will use
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Test DB connection
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ExpenseDbContext>();
    try
    {
        await db.Database.CanConnectAsync();
        Console.WriteLine("✓ Database connected successfully");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"✗ Connection failed: {ex.Message}");
    }
}

app.Run();

