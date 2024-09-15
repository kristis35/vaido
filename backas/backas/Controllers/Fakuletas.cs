using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using backas;

namespace backas.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FakultetasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FakultetasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Create a new fakultetas (faculty)
        [HttpPost("create")]
        public async Task<IActionResult> CreateFakultetas([FromBody] FakultetasRequest request)
        {
            if (string.IsNullOrEmpty(request.Pavadinimas) || string.IsNullOrEmpty(request.TrumpasPavadinimas) || !request.UniversitetasId.HasValue)
            {
                return BadRequest("Faculty name, short name, and university ID are required.");
            }

            var university = await _context.Universitetai.FindAsync(request.UniversitetasId);
            if (university == null)
            {
                return NotFound("University not found.");
            }

            var newFakultetas = new Fakultetas
            {
                Pavadinimas = request.Pavadinimas,
                TrumpasPavadinimas = request.TrumpasPavadinimas,
                UniversitetasId = request.UniversitetasId.Value
            };

            _context.Fakultetai.Add(newFakultetas);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Faculty created successfully.", fakultetas = newFakultetas });
        }

        // Get all fakultetai
        [HttpGet("all")]
        public async Task<IActionResult> GetAllFakultetai()
        {
            var fakultetai = await _context.Fakultetai.Include(f => f.Universitetas).ToListAsync();
            return Ok(fakultetai);
        }

        // Get a fakultetas by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFakultetasById(int id)
        {
            var fakultetas = await _context.Fakultetai.Include(f => f.Universitetas).FirstOrDefaultAsync(f => f.Id == id);
            if (fakultetas == null)
            {
                return NotFound("Faculty not found.");
            }

            return Ok(fakultetas);
        }

        // Update a fakultetas
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateFakultetas(int id, [FromBody] FakultetasRequest request)
        {
            var fakultetas = await _context.Fakultetai.FindAsync(id);
            if (fakultetas == null)
            {
                return NotFound("Faculty not found.");
            }

            if (string.IsNullOrEmpty(request.Pavadinimas) || string.IsNullOrEmpty(request.TrumpasPavadinimas))
            {
                return BadRequest("Faculty name and short name are required.");
            }

            var university = await _context.Universitetai.FindAsync(request.UniversitetasId);
            if (university == null)
            {
                return NotFound("University not found.");
            }

            fakultetas.Pavadinimas = request.Pavadinimas;
            fakultetas.TrumpasPavadinimas = request.TrumpasPavadinimas;
            fakultetas.UniversitetasId = request.UniversitetasId.Value;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Faculty updated successfully.", fakultetas });
        }

        // Delete a fakultetas
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteFakultetas(int id)
        {
            var fakultetas = await _context.Fakultetai.FindAsync(id);
            if (fakultetas == null)
            {
                return NotFound("Faculty not found.");
            }

            _context.Fakultetai.Remove(fakultetas);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Faculty deleted successfully." });
        }
    }

    // Request model for creating and updating a fakultetas
    public class FakultetasRequest
    {
        public string Pavadinimas { get; set; }  // Faculty name
        public string TrumpasPavadinimas { get; set; }  // Short name of the faculty
        public int? UniversitetasId { get; set; }  // University ID (required)
    }
}
