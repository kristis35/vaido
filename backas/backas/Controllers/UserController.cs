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
            var existingUser = await _context.vartotojai.FirstOrDefaultAsync(u => u.PrisijungimoVardas == request.PrisijungimoVardas);
            if (existingUser != null)
            {
                return Conflict("A user with this username already exists.");
            }

            // Optional: Check if the specified university exists (only if universitetasId is provided)
            if (request.universitetasId.HasValue)
            {
                var universitetas = await _context.universitetai.FindAsync(request.universitetasId);
                if (universitetas == null)
                {
                    return NotFound("University not found.");
                }
            }

            // Optional: Check if the specified faculty exists (only if fakultetasId is provided)
            if (request.fakultetasId.HasValue)
            {
                var fakultetas = await _context.fakultetai.FindAsync(request.fakultetasId);
                if (fakultetas == null)
                {
                    return NotFound("Faculty not found.");
                }
            }

            // Generate random password based on Vardas, Pavarde, and a random number
            var random = new Random();
            string generatedPassword = $"{request.Vardas}{request.Pavarde}{random.Next(1000, 9999)}";

            // Create the new user
            var newUser = new vartotojai
            {
                PrisijungimoVardas = request.PrisijungimoVardas,
                Vardas = request.Vardas,
                Pavarde = request.Pavarde,
                Telefonas = request.Telefonas,
                VartotojoRole = request.VartotojoRole,
                universitetasId = request.universitetasId,  // This will remain null if not provided
                fakultetasId = request.fakultetasId,  // This will remain null if not provided
                Slaptazodis = generatedPassword  // Save the generated password
            };

            // Save user to the database
            _context.vartotojai.Add(newUser);
            await _context.SaveChangesAsync();

            // Send an email with the login credentials
            try
            {
                var subject = "Prisijungimo duomenys prie vinjetes.lt sistemos";
                var body = $@"
            Laba diena.

            Siunčiame prisijungimo prie vinjetes.lt sistemos duomenis.

            Prisijungimo vardas: {newUser.PrisijungimoVardas}
            Slaptažodis: {generatedPassword}

            Kviečiame prisijungti ir užpildyti savo grupiokų sąrašą.";

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
            var user = await _context.vartotojai
                        .Include(u => u.universitetas)  // Optionally include related data
                        .Include(u => u.fakultetas)     // Optionally include related data
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
                universitetasId = user.universitetasId,  // Return universitetasId instead of the name
                fakultetasId = user.fakultetasId           // Null-safe navigation
            });
        }

        [HttpPut("edit-user/{id}")]
        public async Task<IActionResult> EditUser(int id, [FromBody] EditUserRequest request)
        {
            // Fetch the user from the database
            var user = await _context.vartotojai.FirstOrDefaultAsync(u => u.Id == id);

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
            if (request.universitetasId.HasValue)
            {
                var universitetas = await _context.universitetai.FindAsync(request.universitetasId);
                if (universitetas == null)
                {
                    return NotFound("University not found.");
                }
                user.universitetasId = request.universitetasId;
            }

            if (request.fakultetasId.HasValue)
            {
                var fakultetas = await _context.fakultetai.FindAsync(request.fakultetasId);
                if (fakultetas == null)
                {
                    return NotFound("Faculty not found.");
                }
                user.fakultetasId = request.fakultetasId;
            }

            // Save the changes to the database
            await _context.SaveChangesAsync();

            // Return a success response
            return Ok(new { message = "User updated successfully." });
        }

        [HttpGet("get-all-users")]
        public async Task<IActionResult> GetAllUsers()
        {
            // Fetch all users from the database
            var users = await _context.vartotojai
                        .Include(u => u.universitetas)  // Optionally include related data
                        .Include(u => u.fakultetas)     // Optionally include related data
                        .Select(u => new
                        {
                            u.Id,
                            u.PrisijungimoVardas,
                            u.Vardas,
                            u.Pavarde,
                            u.Telefonas,
                            u.VartotojoRole,
                            universitetasId = u.universitetasId,  // Return universitetasId instead of the name
                            fakultetasId = u.fakultetasId             // Null-safe navigation
                        })
                        .ToListAsync();

            // Return the list of users in the response
            return Ok(users);
        }

        [HttpGet("get-users-by-group/{groupId}")]
        public async Task<IActionResult> GetUsersByGroupId(int groupId)
        {
            // Fetch users who belong to the specified group ID
            var users = await _context.vartotojai
                            .Where(u => u.grupeId == groupId)  // Filter users by group ID
                            .Include(u => u.universitetas)  // Optionally include related data
                            .Include(u => u.fakultetas)     // Optionally include related data
                            .Select(u => new
                            {
                                u.Id,
                                u.PrisijungimoVardas,
                                u.Vardas,
                                u.Pavarde,
                                u.Telefonas,
                                u.VartotojoRole,
                                universitetasId = u.universitetasId,  // Return universitetasId instead of the name
                                fakultetasId = u.fakultetasId               // Null-safe navigation
                            })
                            .ToListAsync();

            // Check if any users were found
            if (users == null || users.Count == 0)
            {
                return NotFound("No users found in this group.");
            }

            // Return the list of users in the response
            return Ok(users);
        }

        [HttpDelete("delete-user/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            // Fetch the user from the database
            var user = await _context.vartotojai.FindAsync(id);

            // Check if the user exists
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Remove the user from the database
            _context.vartotojai.Remove(user);
            await _context.SaveChangesAsync();

            // Return a success response
            return Ok(new { message = "User deleted successfully." });
        }

        [HttpPut("remove-user-from-group/{userId}")]
        public async Task<IActionResult> RemoveUserFromGroup(int userId)
        {
            // Fetch the user from the database
            var user = await _context.vartotojai.FindAsync(userId);

            // Check if the user exists
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Check if the user is associated with a group
            if (user.grupeId == null)
            {
                return BadRequest("User is not associated with any group.");
            }

            // Remove the user from the group
            user.grupeId = null;
            await _context.SaveChangesAsync();

            // Return a success response
            return Ok(new { message = "User removed from group successfully." });
        }

    }
}
