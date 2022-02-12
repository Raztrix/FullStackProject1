using FactoryWebsite.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FactoryWebsite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShiftController : Controller
    {
        private readonly ApplicationDbContext _context;
        public ShiftController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]

        public async Task<ActionResult<List<Shift>>> getAll()
        {
            var allShifts = _context.Shifts.ToList();
            if (allShifts.Any())
            {
                return Ok(allShifts);
            }
            return BadRequest("There are no shifts");
        }

        [HttpPost("empReg/{id}")]

        public async Task<ActionResult<List<Employee>>> getEmployeeRegistered(int id)
        {
            var shiftsByShiftId = _context.EmployeeShifts.Where(shift => shift.Shift_id == id).ToList();
            if (shiftsByShiftId.Any())
            {
                List<Employee> employeesList = new List<Employee>();
                foreach (var shift in shiftsByShiftId)
                {
                    var registeredEmployees = _context.Employees.Where(emp => emp.EmployeeID == shift.Employee_id).FirstOrDefault();
                    if (registeredEmployees != null)
                    {
                        employeesList.Add(registeredEmployees);
                    }
                }
                return Ok(employeesList);
            }
            return BadRequest("Shift Not Found");

        }

        [HttpPost("addShift")]

        public async Task<ActionResult<List<Shift>>> AddShift(Shift request)
        {
            var shiftCheck = _context.Shifts.Where(shift => (shift.Date == request.Date)&&(shift.StartTime == request.StartTime) && (shift.EndTime == request.EndTime)).ToList();
            if(shiftCheck.Any() == false)
            {
                var newShift = new Shift();
                newShift.Date = request.Date;
                newShift.StartTime = request.StartTime;
                newShift.EndTime = request.EndTime;
                _context.Shifts.Add(newShift);
                await _context.SaveChangesAsync();
                return Ok(await _context.Shifts.ToListAsync());
            }
            return BadRequest("Shift Already Exist");
        }
    }
}
