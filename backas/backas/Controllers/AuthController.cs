using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using backas.DTO;

namespace backas.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.PrisijungimoVardas) || string.IsNullOrEmpty(request.Slaptazodis))
            {
                return BadRequest("Username and password are required.");
            }

            var user = await _context.Vartotojai
                .FirstOrDefaultAsync(u => u.PrisijungimoVardas == request.PrisijungimoVardas);

            if (user == null || user.Slaptazodis != request.Slaptazodis)
            {
                return Unauthorized("Invalid username or password.");
            }

            // Generate JWT token
            var token = GenerateJwtToken(user);

            return Ok(new
            {
                message = "Login successful",
                token = token,
                userId = user.Id  // Return the user ID
            });
        }


        private string GenerateJwtToken(Vartotojai user)
        {
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Secret"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Vardas),
                    new Claim(ClaimTypes.Role, user.VartotojoRole)
                }),
                Expires = DateTime.UtcNow.AddMinutes(30),  // Token expires in 30 minutes
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
