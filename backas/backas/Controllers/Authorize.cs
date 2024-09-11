using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backas.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]  // This will require a valid JWT token
    public class SecureController : ControllerBase
    {
        [HttpGet("secure-data")]
        public IActionResult GetSecureData()
        {
            return Ok("This is secured data.");
        }
    }
}
