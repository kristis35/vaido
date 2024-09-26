using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using backas;

namespace backas.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UniversityCrud : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UniversityCrud(ApplicationDbContext context)
        {
            _context = context;
        }

        // Create a new university
        [HttpPost("create")]
        public async Task<IActionResult> CreateUniversity([FromBody] UniversityRequest request)
        {
            if (string.IsNullOrEmpty(request.Pavadinimas) || string.IsNullOrEmpty(request.TrumpasPavadinimas))
            {
                return BadRequest("University name and short name are required.");
            }

            var newUniversity = new universitetas
            {
                Pavadinimas = request.Pavadinimas,
                TrumpasPavadinimas = request.TrumpasPavadinimas
            };

            _context.universitetai.Add(newUniversity);
            await _context.SaveChangesAsync();

            return Ok(new { message = "University created successfully." });
        }

        // Get all universities
        [HttpGet("all")]
        public async Task<IActionResult> GetAllUniversities()
        {
            var universities = await _context.universitetai.ToListAsync();
            return Ok(universities);
        }

        // Get a university by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUniversityById(int id)
        {
            var university = await _context.universitetai.FindAsync(id);
            if (university == null)
            {
                return NotFound("University not found.");
            }

            return Ok(university);
        }

        // Update a university
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateUniversity(int id, [FromBody] UniversityRequest request)
        {
            var university = await _context.universitetai.FindAsync(id);
            if (university == null)
            {
                return NotFound("University not found.");
            }

            if (string.IsNullOrEmpty(request.Pavadinimas) || string.IsNullOrEmpty(request.TrumpasPavadinimas))
            {
                return BadRequest("University name and short name are required.");
            }

            university.Pavadinimas = request.Pavadinimas;
            university.TrumpasPavadinimas = request.TrumpasPavadinimas;

            await _context.SaveChangesAsync();

            return Ok(new { message = "University updated successfully." });
        }

        // Delete a university
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteUniversity(int id)
        {
            var university = await _context.universitetai.FindAsync(id);
            if (university == null)
            {
                return NotFound("University not found.");
            }

            _context.universitetai.Remove(university);
            await _context.SaveChangesAsync();

            return Ok(new { message = "University deleted successfully." });
        }
    }

    // Request model for creating and updating a university
    public class UniversityRequest
    {
        public string Pavadinimas { get; set; }
        public string TrumpasPavadinimas { get; set; }
    }
}
