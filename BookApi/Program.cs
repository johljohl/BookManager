using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using BookApi.Data;  // Ensure the correct namespace is used

var builder = WebApplication.CreateBuilder(args);

// Add necessary services to the container
builder.Services.AddControllers();  // Register controllers
builder.Services.AddEndpointsApiExplorer();  // Enable minimal API support
builder.Services.AddSwaggerGen();  // Enable Swagger for API documentation

// Register DbContext for SQL Server with connection string from configuration
builder.Services.AddDbContext<BookContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Get JWT settings from configuration
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured.");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("JWT Issuer not configured.");
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? throw new InvalidOperationException("JWT Audience not configured.");

// Configure JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,  // Ensure token issuer is valid
            ValidateAudience = true,  // Ensure token audience is valid
            ValidateLifetime = true,  // Ensure token is still valid
            ValidateIssuerSigningKey = true,  // Ensure signing key is valid
            ValidIssuer = jwtIssuer,  // Set issuer from configuration
            ValidAudience = jwtAudience,  // Set audience from configuration
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),  // Set signing key from configuration
            ClockSkew = TimeSpan.Zero  // No additional time allowance for token expiration
        };

        // Add a custom event to handle token expiration
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                if (context.Exception is SecurityTokenExpiredException)
                {
                    context.Response.Headers.Add("Token-Expired", "true");  // Add a header if the token is expired
                }
                return Task.CompletedTask;
            }
        };
    });

// Configure CORS to allow requests from the specified frontend domain
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder =>
    {
        builder.WithOrigins("https://bookmanager-3.onrender.com")  // Set the allowed origin (frontend URL)
               .AllowAnyMethod()  // Allow all HTTP methods (GET, POST, etc.)
               .AllowAnyHeader()  // Allow all headers
               .AllowCredentials();  // Allow credentials (cookies, tokens, etc.)
    });
});

// Set dynamic port based on the environment (for deployment platforms like Render)
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";  // Default to 8080 if no environment variable is set
builder.WebHost.UseUrls($"http://*:{port}");  // Set the URL and port for the app to listen on

var app = builder.Build();

// Enable Swagger in development and production environments
if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
        c.RoutePrefix = string.Empty;  // Serve Swagger UI at the app's root
    });
}

// Apply CORS policy
app.UseCors("AllowSpecificOrigin");

// Add authentication and authorization middleware
app.UseAuthentication();
app.UseAuthorization();

// Map controller routes
app.MapControllers();

// Start the application
app.Run();
