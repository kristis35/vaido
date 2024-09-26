using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using backas;

namespace backas.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class fakultetasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public fakultetasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Create a new fakultetas (faculty)
        [HttpPost("create")]
        public async Task<IActionResult> Createfakultetas([FromBody] fakultetasRequest request)
        {
            if (string.IsNullOrEmpty(request.Pavadinimas) || string.IsNullOrEmpty(request.TrumpasPavadinimas) || !request.universitetasId.HasValue)
            {
                return BadRequest("Faculty name, short name, and university ID are required.");
            }

            var university = await _context.universitetai.FindAsync(request.universitetasId);
            if (university == null)
            {
                return NotFound("University not found.");
            }

            var newfakultetas = new fakultetas
            {
                Pavadinimas = request.Pavadinimas,
                TrumpasPavadinimas = request.TrumpasPavadinimas,
                universitetasId = request.universitetasId.Value
            };

            _context.fakultetai.Add(newfakultetas);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Faculty created successfully.", fakultetas = newfakultetas });
        }

        // Get all fakultetai
        [HttpGet("all")]
        public async Task<IActionResult> GetAllfakultetai()
        {
            var fakultetai = await _context.fakultetai.Include(f => f.universitetas).ToListAsync();
            return Ok(fakultetai);
        }

        // Get a fakultetas by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetfakultetasById(int id)
        {
            var fakultetas = await _context.fakultetai.Include(f => f.universitetas).FirstOrDefaultAsync(f => f.Id == id);
            if (fakultetas == null)
            {
                return NotFound("Faculty not found.");
            }

            return Ok(fakultetas);
        }

        // Update a fakultetas
        [HttpPut("update/{id}")]
        public async Task<IActionResult> Updatefakultetas(int id, [FromBody] fakultetasRequest request)
        {
            var fakultetas = await _context.fakultetai.FindAsync(id);
            if (fakultetas == null)
            {
                return NotFound("Faculty not found.");
            }

            if (string.IsNullOrEmpty(request.Pavadinimas) || string.IsNullOrEmpty(request.TrumpasPavadinimas))
            {
                return BadRequest("Faculty name and short name are required.");
            }

            var university = await _context.universitetai.FindAsync(request.universitetasId);
            if (university == null)
            {
                return NotFound("University not found.");
            }

            fakultetas.Pavadinimas = request.Pavadinimas;
            fakultetas.TrumpasPavadinimas = request.TrumpasPavadinimas;
            fakultetas.universitetasId = request.universitetasId.Value;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Faculty updated successfully.", fakultetas });
        }

        // Delete a fakultetas
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Deletefakultetas(int id)
        {
            var fakultetas = await _context.fakultetai.FindAsync(id);
            if (fakultetas == null)
            {
                return NotFound("Faculty not found.");
            }

            _context.fakultetai.Remove(fakultetas);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Faculty deleted successfully." });
        }
    }

    // Request model for creating and updating a fakultetas
    public class fakultetasRequest
    {
        public string Pavadinimas { get; set; }  // Faculty name
        public string TrumpasPavadinimas { get; set; }  // Short name of the faculty
        public int? universitetasId { get; set; }  // University ID (required)
    }
}
