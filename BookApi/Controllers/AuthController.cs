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
            _config = config ?? throw new ArgumentNullException(nameof(config));  // Ensure _config is not null
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

            return NotFound("User not found");
        }

        private UserModel? Authenticate(UserLogin userLogin)  // Return type made nullable
        {
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
    }

    public class UserLogin
    {
        public string Username { get; set; } = string.Empty;  // Initialized with default value
        public string Password { get; set; } = string.Empty;  // Initialized with default value
    }

    public class UserModel
    {
        public string Username { get; set; } = string.Empty;      // Initialized with default value
        public string EmailAddress { get; set; } = string.Empty;  // Initialized with default value
        public string GivenName { get; set; } = string.Empty;     // Initialized with default value
        public string Surname { get; set; } = string.Empty;       // Initialized with default value
    }
}
