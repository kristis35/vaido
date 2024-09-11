using backas.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace backas.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
        {
            // Validate request data
            if (string.IsNullOrEmpty(request.PrisijungimoVardas) || string.IsNullOrEmpty(request.Vardas) || string.IsNullOrEmpty(request.Pavarde))
            {
                return BadRequest("Username, first name, and last name are required.");
            }

            // Check if user already exists
            var existingUser = await _context.Vartotojai.FirstOrDefaultAsync(u => u.PrisijungimoVardas == request.PrisijungimoVardas);
            if (existingUser != null)
            {
                return Conflict("A user with this username already exists.");
            }

            // Check if the specified university and faculty exist
            var universitetas = await _context.Universitetai.FindAsync(request.UniversitetasId);
            if (universitetas == null)
            {
                return NotFound("University not found.");
            }

            var fakultetas = await _context.Fakultetai.FindAsync(request.FakultetasId);
            if (fakultetas == null)
            {
                return NotFound("Faculty not found.");
            }

            // Generate random password based on Vardas, Pavarde, and a random number
            var random = new Random();
            string generatedPassword = $"{request.Vardas}{request.Pavarde}{random.Next(1000, 9999)}";

            // Create the new user
            var newUser = new Vartotojai
            {
                PrisijungimoVardas = request.PrisijungimoVardas,
                Vardas = request.Vardas,
                Pavarde = request.Pavarde,
                Telefonas = request.Telefonas,
                VartotojoRole = request.VartotojoRole,
                UniversitetasId = request.UniversitetasId,
                FakultetasId = request.FakultetasId,
                Slaptazodis = generatedPassword  // Save the generated password
            };

            // Save user to database
            _context.Vartotojai.Add(newUser);
            await _context.SaveChangesAsync();

            // Return success response with the generated password
            return Ok(new
            {
                message = "User created successfully.",
                password = generatedPassword
            });
        }
    }
}
