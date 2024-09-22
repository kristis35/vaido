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

            // Handling file upload
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
                        Slaptazodis = GenerateRandomPassword(),
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
                                Slaptazodis = GenerateRandomPassword(),
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

        private string GenerateRandomPassword()
        {
            var random = new Random();
            return $"Pass{random.Next(1000, 9999)}";
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
        public IFormFile ExcelFile { get; set; }  // Excel file for bulk upload
        public List<UserRequest> Users { get; set; }  // For manual input
    }

    public class UserRequest
    {
        public string Vardas { get; set; }
        public string Pavarde { get; set; }
        public string ElPastas { get; set; }
        public string Telefonas { get; set; }
    }
}
