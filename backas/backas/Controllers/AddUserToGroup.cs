using backas.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace backas.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GroupController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GroupController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateGroup([FromBody] GroupCreateRequest request)
        {
            // Create the new group
            var newGroup = new Grupe
            {
                Pavadinimas = request.Pavadinimas,
                IlgasPavadinimas = request.IlgasPavadinimas,
                UniversitetasId = request.UniversitetasId,
                FakultetasId = request.FakultetasId,
                ĮstojimoMetai = request.ĮstojimoMetai,
                BaigimoMetai = request.BaigimoMetai,
                StudentuSkaicius = request.StudentuSkaicius,
                SumoketasAvansas = request.SumoketasAvansas,
                ApmokejimoStadija = request.ApmokejimoStadija,
                GamybosStadija = request.GamybosStadija,
                PasleptiGrupe = request.PasleptiGrupe,
                Pastabos = request.Pastabos,
                PatvirtintasSarasas = request.PatvirtintasSarasas,
                BalsavimasMaketai = request.BalsavimasMaketai,
                GrupesSeniunas = request.GrupesSeniunas,
                FotografavimoDataVieta = request.FotografavimoDataVieta
            };

            _context.Grupes.Add(newGroup);
            await _context.SaveChangesAsync();

            // Update the Seniunas to associate with the new group
            var seniunas = await _context.Vartotojai.FindAsync(request.GrupesSeniunas);
            if (seniunas != null)
            {
                seniunas.GrupeId = newGroup.Id;
                await _context.SaveChangesAsync();
            }
            else
            {
                return NotFound("Seniunas not found.");
            }

            return Ok(new { message = "Group created successfully and Seniunas updated.", groupId = newGroup.Id });
        }

        // Get a group by ID
        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetGroupById(int id)
        {
            var group = await _context.Grupes
                            .Include(g => g.Universitetas)
                            .Include(g => g.Fakultetas)
                            .Include(g => g.Vartotojai)
                            .FirstOrDefaultAsync(g => g.Id == id);

            if (group == null)
            {
                return NotFound("Group not found.");
            }

            return Ok(group);
        }

        // Get all groups
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllGroups()
        {
            var groups = await _context.Grupes
                            .Include(g => g.Universitetas)
                            .Include(g => g.Fakultetas)
                            .Include(g => g.Vartotojai)
                            .ToListAsync();

            return Ok(groups);
        }

        // Update a group
        [HttpPut("edit/{id}")]
        public async Task<IActionResult> EditGroup(int id, [FromBody] GroupEditRequest request)
        {
            var group = await _context.Grupes.FindAsync(id);

            if (group == null)
            {
                return NotFound("Group not found.");
            }

            group.Pavadinimas = request.Pavadinimas;
            group.IlgasPavadinimas = request.IlgasPavadinimas;
            group.UniversitetasId = request.UniversitetasId;
            group.FakultetasId = request.FakultetasId;
            group.ĮstojimoMetai = request.ĮstojimoMetai;
            group.BaigimoMetai = request.BaigimoMetai;
            group.StudentuSkaicius = request.StudentuSkaicius;
            group.SumoketasAvansas = request.SumoketasAvansas;
            group.ApmokejimoStadija = request.ApmokejimoStadija;
            group.GamybosStadija = request.GamybosStadija;
            group.PasleptiGrupe = request.PasleptiGrupe;
            group.Pastabos = request.Pastabos;
            group.PatvirtintasSarasas = request.PatvirtintasSarasas;
            group.BalsavimasMaketai = request.BalsavimasMaketai;
            group.GrupesSeniunas = request.GrupesSeniunas;
            group.FotografavimoDataVieta = request.FotografavimoDataVieta;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Group updated successfully." });
        }

        // Delete a group
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteGroup(int id)
        {
            var group = await _context.Grupes.FindAsync(id);

            if (group == null)
            {
                return NotFound("Group not found.");
            }

            _context.Grupes.Remove(group);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Group deleted successfully." });
        }

        // Get group by user ID
        [HttpGet("get-by-user/{userId}")]
        public async Task<IActionResult> GetGroupByUserId(int userId)
        {
            // Find the user by ID
            var user = await _context.Vartotojai
                                .Include(u => u.Grupe)
                                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Get the group associated with the user
            var group = await _context.Grupes
                                .Include(g => g.Universitetas)
                                .Include(g => g.Fakultetas)
                                .Include(g => g.Vartotojai)
                                .FirstOrDefaultAsync(g => g.Id == user.GrupeId);

            if (group == null)
            {
                return NotFound("Group not found.");
            }

            return Ok(group);
        }


        [HttpPost("add-user-to-group")]
        public async Task<IActionResult> AddUserToGroup([FromForm] GroupUserRequest request)
        {
            // Check if group exists
            var group = await _context.Grupes
                            .Include(g => g.Vartotojai)
                            .FirstOrDefaultAsync(g => g.Id == request.GroupId);

            if (group == null)
            {
                return NotFound("Group not found.");
            }

            // Handling file upload if the file is provided
            if (request.ExcelFile != null && request.ExcelFile.Length > 0)
            {
                // Process the Excel file
                List<Vartotojai> users = ParseExcelFile(request.ExcelFile, group);
                if (users == null)
                {
                    return BadRequest("Invalid Excel file format.");
                }

                foreach (var user in users)
                {
                    _context.Vartotojai.Add(user);
                }
            }
            else if (request.Users != null && request.Users.Count > 0)
            {
                // Handling manual user input
                foreach (var userRequest in request.Users)
                {
                    var user = new Vartotojai
                    {
                        Vardas = userRequest.Vardas,
                        Pavarde = userRequest.Pavarde,
                        PrisijungimoVardas = userRequest.ElPastas,  // Using email as username
                        Telefonas = userRequest.Telefonas,
                        VartotojoRole = "studentas",
                        Slaptazodis = GenerateRandomPassword(userRequest.Vardas, userRequest.Pavarde),
                        FakultetasId = group.FakultetasId,
                        UniversitetasId = group.UniversitetasId,
                        GrupeId = group.Id
                    };

                    _context.Vartotojai.Add(user);
                }
            }
            else
            {
                return BadRequest("No users or Excel file provided.");
            }

            // Save users to database
            await _context.SaveChangesAsync();

            // Schedule reminder if not all users have emails filled
            if (group.Vartotojai.Any(u => string.IsNullOrEmpty(u.PrisijungimoVardas)))
            {
                ScheduleReminderForIncompleteGroup(group.Id);
            }

            return Ok(new { message = "Users added to the group successfully." });
        }

        private List<Vartotojai> ParseExcelFile(IFormFile excelFile, Grupe group)
        {
            List<Vartotojai> users = new List<Vartotojai>();
            using (var stream = new MemoryStream())
            {
                excelFile.CopyTo(stream);
                using (var package = new ExcelPackage(stream))
                {
                    var worksheet = package.Workbook.Worksheets[0];
                    int rowCount = worksheet.Dimension.Rows;

                    for (int row = 2; row <= rowCount; row++)  // Skip header row
                    {
                        try
                        {
                            var lastName = worksheet.Cells[row, 2].Text;
                            var firstName = worksheet.Cells[row, 3].Text;
                            var email = worksheet.Cells[row, 4].Text;
                            var phone = worksheet.Cells[row, 5].Text;

                            var user = new Vartotojai
                            {
                                Vardas = firstName,
                                Pavarde = lastName,
                                PrisijungimoVardas = email,
                                Telefonas = phone,
                                VartotojoRole = "studentas",
                                Slaptazodis = GenerateRandomPassword(firstName, lastName),
                                FakultetasId = group.FakultetasId,
                                UniversitetasId = group.UniversitetasId,
                                GrupeId = group.Id  // Associate user with the group
                            };

                            users.Add(user);
                        }
                        catch
                        {
                            return null;  // Return null if there is an error in the format
                        }
                    }
                }
            }

            return users;
        }

        private string GenerateRandomPassword(string vardas, string pavarde)
        {
            var random = new Random();
            return $"{vardas}{pavarde}{random.Next(1000, 9999)}";
        }

        private void ScheduleReminderForIncompleteGroup(int groupId)
        {
            // Logic for scheduling reminders (e.g., using Hangfire or other background job)
            // You can check for completion after 3 days and send a reminder if not completed.
        }
    }

    public class GroupUserRequest
    {
        public int GroupId { get; set; }  // ID of the group

        [FromForm]
        public IFormFile? ExcelFile { get; set; }  // Excel file for bulk upload, optional

        [FromForm]
        public List<UserRequest> Users { get; set; }  // For manual input
    }

    public class UserRequest
    {
        public string Vardas { get; set; }
        public string Pavarde { get; set; }
        public string ElPastas { get; set; }
        public string Telefonas { get; set; }
    }
    public class GroupCreateRequest
    {
        public string Pavadinimas { get; set; }
        public string IlgasPavadinimas { get; set; }
        public int UniversitetasId { get; set; }
        public int FakultetasId { get; set; }
        public int ĮstojimoMetai { get; set; }
        public int BaigimoMetai { get; set; }
        public int StudentuSkaicius { get; set; }
        public decimal SumoketasAvansas { get; set; }
        public string ApmokejimoStadija { get; set; }
        public string GamybosStadija { get; set; }
        public bool PasleptiGrupe { get; set; }
        public string Pastabos { get; set; }
        public bool PatvirtintasSarasas { get; set; }
        public bool BalsavimasMaketai { get; set; }
        public int GrupesSeniunas { get; set; }
        public string FotografavimoDataVieta { get; set; }
    }

    public class GroupEditRequest : GroupCreateRequest
    {
        // No additional properties; reuse the same properties from GroupCreateRequest for editing.
    }
}
