using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BookApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;

        public AuthController(IConfiguration config)
        {
            _config = config ?? throw new ArgumentNullException(nameof(config));
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLogin userLogin)
        {
            var user = Authenticate(userLogin);

            if (user != null)
            {
                var token = GenerateToken(user);
                return Ok(new { token });
            }

            return Unauthorized(new { message = "Invalid username or password" });
        }

        [HttpPost("refresh")]
        public IActionResult RefreshToken()
        {
            var currentToken = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            // Validate the current token and generate a new one if valid
            if (IsValidToken(currentToken, out UserModel user))
            {
                var newToken = GenerateToken(user);
                return Ok(new { token = newToken });
            }
            return Unauthorized(new { message = "Invalid token" });
        }

        private bool IsValidToken(string token, out UserModel user)
        {
            user = null;
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    ValidateLifetime = false, // Do not check for token expiration here
                    ValidIssuer = _config["Jwt:Issuer"],
                    ValidAudience = _config["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                };

                var principal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);

                // Validate the token expiration manually if needed
                if (validatedToken is JwtSecurityToken jwtToken && jwtToken.ValidTo > DateTime.UtcNow)
                {
                    user = new UserModel
                    {
                        Username = principal.FindFirst(ClaimTypes.Name)?.Value,
                        EmailAddress = principal.FindFirst(ClaimTypes.Email)?.Value,
                        GivenName = principal.FindFirst(ClaimTypes.GivenName)?.Value,
                        Surname = principal.FindFirst(ClaimTypes.Surname)?.Value
                    };
                    return true;
                }
            }
            catch
            {
                // Handle or log the exception
            }
            return false;
        }

        private string GenerateToken(UserModel user)
        {
            var jwtKey = _config["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured.");
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim(JwtRegisteredClaimNames.Email, user.EmailAddress),
                new Claim(JwtRegisteredClaimNames.GivenName, user.GivenName),
                new Claim(JwtRegisteredClaimNames.FamilyName, user.Surname),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private UserModel? Authenticate(UserLogin userLogin)
        {
            // This is a mock example, replace with your user authentication logic
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

            return null;
        }
    }

    public class UserLogin
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class UserModel
    {
        public string Username { get; set; } = string.Empty;
        public string EmailAddress { get; set; } = string.Empty;
        public string GivenName { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
    }
}
