using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BookApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController] // Marks this as an API controller
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config; // Used to access configuration settings like JWT key and issuer

        public AuthController(IConfiguration config)
        {
            _config = config ?? throw new ArgumentNullException(nameof(config)); // Ensures config is not null
        }

        // POST: api/auth/login - Handles user login and generates a JWT if authentication is successful
        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLogin userLogin)
        {
            var user = Authenticate(userLogin); // Try to authenticate the user

            if (user != null) // If authentication succeeds
            {
                var token = GenerateToken(user); // Generate JWT for the authenticated user
                return Ok(new { token }); // Return the token in the response
            }

            return Unauthorized(new { message = "Invalid username or password" }); // Return 401 if authentication fails
        }

        // POST: api/auth/refresh - Refreshes the JWT if the current token is valid
        [HttpPost("refresh")]
        public IActionResult RefreshToken()
        {
            var currentToken = Request.Headers["Authorization"].ToString().Replace("Bearer ", ""); // Extract token from Authorization header

            if (IsValidToken(currentToken, out UserModel user)) // Check if the token is valid
            {
                var newToken = GenerateToken(user); // Generate a new token
                return Ok(new { token = newToken }); // Return the new token
            }

            return Unauthorized(new { message = "Invalid token" }); // Return 401 if token is invalid
        }

        // Validates the provided token and extracts user information if valid
        private bool IsValidToken(string token, out UserModel user)
        {
            user = null;
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]); // Get the JWT key from config
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    ValidateLifetime = false, // Token expiration is checked manually
                    ValidIssuer = _config["Jwt:Issuer"],
                    ValidAudience = _config["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                };

                var principal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken); // Validate the token

                if (validatedToken is JwtSecurityToken jwtToken && jwtToken.ValidTo > DateTime.UtcNow) // Check token expiration manually
                {
                    // Extract user claims and create a UserModel
                    user = new UserModel
                    {
                        Username = principal.FindFirst(ClaimTypes.Name)?.Value,
                        EmailAddress = principal.FindFirst(ClaimTypes.Email)?.Value,
                        GivenName = principal.FindFirst(ClaimTypes.GivenName)?.Value,
                        Surname = principal.FindFirst(ClaimTypes.Surname)?.Value
                    };
                    return true; // Token is valid
                }
            }
            catch
            {
                // Token validation failed, handle if necessary
            }

            return false; // Token is invalid
        }

        // Generates a JWT token for the authenticated user
        private string GenerateToken(UserModel user)
        {
            var jwtKey = _config["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured."); // Ensure the key is present
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)); // Create security key
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256); // Set signing credentials

            // Define the claims to be included in the token
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim(JwtRegisteredClaimNames.Email, user.EmailAddress),
                new Claim(JwtRegisteredClaimNames.GivenName, user.GivenName),
                new Claim(JwtRegisteredClaimNames.FamilyName, user.Surname),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // Unique token identifier
            };

            // Create the token with issuer, audience, claims, expiration, and signing credentials
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30), // Set token expiration to 30 minutes
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token); // Return the generated JWT
        }

        // Authenticates the user based on the provided credentials
        private UserModel? Authenticate(UserLogin userLogin)
        {
            // This is a mock example, replace with actual user authentication logic (e.g., check against a database)
            if (userLogin.Username == "test" && userLogin.Password == "password")
            {
                return new UserModel
                {
                    Username = "test",
                    EmailAddress = "test@domain.com",
                    GivenName = "Test",
                    Surname = "User"
                };
            }

            return null; // Authentication failed
        }
    }

    // Model representing the user login credentials
    public class UserLogin
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    // Model representing the user data returned after authentication
    public class UserModel
    {
        public string Username { get; set; } = string.Empty;
        public string EmailAddress { get; set; } = string.Empty;
        public string GivenName { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
    }
}
