using backas.DTO;
using backas;
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
        private readonly IEmailService _emailService;

        public UserController(ApplicationDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;  // Injecting the EmailService
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

            // Optional: Check if the specified university exists (only if UniversitetasId is provided)
            if (request.UniversitetasId.HasValue)
            {
                var universitetas = await _context.Universitetai.FindAsync(request.UniversitetasId);
                if (universitetas == null)
                {
                    return NotFound("University not found.");
                }
            }

            // Optional: Check if the specified faculty exists (only if FakultetasId is provided)
            if (request.FakultetasId.HasValue)
            {
                var fakultetas = await _context.Fakultetai.FindAsync(request.FakultetasId);
                if (fakultetas == null)
                {
                    return NotFound("Faculty not found.");
                }
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
                UniversitetasId = request.UniversitetasId,  // This will remain null if not provided
                FakultetasId = request.FakultetasId,  // This will remain null if not provided
                Slaptazodis = generatedPassword  // Save the generated password
            };

            // Save user to the database
            _context.Vartotojai.Add(newUser);
            await _context.SaveChangesAsync();

            // Send an email with the login credentials
            try
            {
                var subject = "Your Account Details";
                var body = $"Dear {newUser.Vardas},\n\nYour account has been created successfully.\nUsername: {newUser.PrisijungimoVardas}\nPassword: {generatedPassword}\n\nPlease change your password upon first login.";
                _emailService.SendEmail(newUser.PrisijungimoVardas, subject, body);
            }
            catch (Exception ex)
            {
                // Log the exception or handle error in case email sending fails
                return StatusCode(500, $"User created, but failed to send email: {ex.Message}");
            }

            // Return success response with the generated password
            return Ok(new
            {
                message = "User created successfully. An email has been sent with login details.",
                password = generatedPassword
            });
        }



        [HttpGet("get-user/{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            // Fetch user from the database based on the provided ID
            var user = await _context.Vartotojai
                        .Include(u => u.Universitetas)  // Optionally include related data
                        .Include(u => u.Fakultetas)     // Optionally include related data
                        .FirstOrDefaultAsync(u => u.Id == id);

            // If user not found, return a 404 NotFound response
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Return user information in the response
            return Ok(new
            {
                user.Id,
                user.PrisijungimoVardas,
                user.Vardas,
                user.Pavarde,
                user.Telefonas,
                user.VartotojoRole,
                Universitetas = user.Universitetas?.Pavadinimas,  // Null-safe navigation
                Fakultetas = user.Fakultetas?.Pavadinimas         // Null-safe navigation
            });
        }

        [HttpPut("edit-user/{id}")]
        public async Task<IActionResult> EditUser(int id, [FromBody] EditUserRequest request)
        {
            // Fetch the user from the database
            var user = await _context.Vartotojai.FirstOrDefaultAsync(u => u.Id == id);

            // Check if the user exists
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Validate request data (you can add more validation if needed)
            if (string.IsNullOrEmpty(request.Vardas) || string.IsNullOrEmpty(request.Pavarde))
            {
                return BadRequest("First name and last name are required.");
            }

            // Update the user's properties
            user.Vardas = request.Vardas;
            user.Pavarde = request.Pavarde;
            user.Telefonas = request.Telefonas;
            user.VartotojoRole = request.VartotojoRole;

            // Optionally, update the university and faculty if needed
            if (request.UniversitetasId.HasValue)
            {
                var universitetas = await _context.Universitetai.FindAsync(request.UniversitetasId);
                if (universitetas == null)
                {
                    return NotFound("University not found.");
                }
                user.UniversitetasId = request.UniversitetasId;
            }

            if (request.FakultetasId.HasValue)
            {
                var fakultetas = await _context.Fakultetai.FindAsync(request.FakultetasId);
                if (fakultetas == null)
                {
                    return NotFound("Faculty not found.");
                }
                user.FakultetasId = request.FakultetasId;
            }

            // Save the changes to the database
            await _context.SaveChangesAsync();

            // Return a success response
            return Ok(new { message = "User updated successfully." });
        }

    }
}
