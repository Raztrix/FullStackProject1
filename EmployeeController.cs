using FactoryWebsite.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FactoryWebsite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : Controller
    {
        private readonly ApplicationDbContext _context;
        public EmployeeController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("employeesInfo")]

        public async Task<IActionResult> GetData()
        {
            var data = _context.Employees.ToList();
            if (data != null)
            {
                return Ok(data);
            }
            return BadRequest(data);
        }

        [HttpPost("{id}")]

        public async Task<IActionResult> GetShiftsDateTime(int id)
        {
            var shiftsIdOfOneEmployee = _context.EmployeeShifts.Where(shift => shift.Employee_id == id).ToList();
            List<DateTime> shiftDate = new List<DateTime> {};

            if (shiftsIdOfOneEmployee.Any())
            {
                for(int i= 0; i < shiftsIdOfOneEmployee.Count; i++)
                {
                   var result = _context.Shifts.Where(shift => shift.ShiftId == shiftsIdOfOneEmployee[i].Shift_id).FirstOrDefault();

                   if(result != null)
                    {
                        shiftDate.Add(result.Date);
                        
                    }
                    
                }
                if (shiftDate.Any()) {

                    return Ok(shiftDate);
                }
                
            }
            return BadRequest("there are no shifts for this employee");
        }

        [HttpPost("shiftTime/{id}")]

        public async Task<IActionResult> GetShiftsTime(int id)
        {
            var shiftsIdOfOneEmployee = _context.EmployeeShifts.Where(shift => shift.Employee_id == id).ToList();
            List<int> shiftTime = new List<int> { };

            if (shiftsIdOfOneEmployee.Any())
            {
                for (int i = 0; i < shiftsIdOfOneEmployee.Count; i++)
                {
                    var result = _context.Shifts.Where(shift => shift.ShiftId == shiftsIdOfOneEmployee[i].Shift_id).FirstOrDefault();

                    if (result != null)
                    {
                        shiftTime.Add(result.StartTime);
                        shiftTime.Add(result.EndTime);

                    }

                }
                if (shiftTime.Any())
                {

                    return Ok(shiftTime);
                }

            }
            return BadRequest("No time found");
        }

        [HttpPut("editEmployee")]

        public async Task<ActionResult<List<Employee>>> EditEmployee(Employee request)
        {

            var employeeDB = await _context.Employees.FindAsync(request.EmployeeID);
            if(employeeDB != null)
            {
                employeeDB.FirstName = request.FirstName;
                employeeDB.LastName = request.LastName;
                employeeDB.StartWorkYear = request.StartWorkYear;
                employeeDB.departmentID = request.departmentID;

                await  _context.SaveChangesAsync();
                return Ok(await _context.Employees.ToListAsync());
            }
            return BadRequest("Employee already exist");
        }

        [HttpDelete("{id}")]

        public async Task<ActionResult<List<Employee>>> DeleteEmployee(int id)
        {
            var shiftsIdOfOneEmployee = _context.EmployeeShifts.Where(shift => shift.Employee_id == id).ToList();
            if (shiftsIdOfOneEmployee.Any())
            {
                foreach(var shift in shiftsIdOfOneEmployee)
                {
                    _context.EmployeeShifts.Remove(shift);
                }
            }
            var dbEmployee = await _context.Employees.FindAsync(id);
            if (dbEmployee != null)
            {
                _context.Employees.Remove(dbEmployee);
                await _context.SaveChangesAsync();
                return Ok(await _context.Employees.ToListAsync());
            }
            return BadRequest("Employee Not Found");
        }

        [HttpPost("addEmployeeShift")]

        public async Task<ActionResult<List<EmployeeShift>>> AddEmployeeShift(EmployeeShift request)
        {
            var shiftsIdOfOneEmployee = _context.EmployeeShifts.Where(shift => (shift.Employee_id == request.Employee_id)&(shift.Shift_id == request.Shift_id)).ToList();
            var checkForShiftID = _context.Shifts.Where(shift => shift.ShiftId == request.Shift_id).ToList();
            var checkEmployeeExist = _context.Employees.Where(emp => emp.EmployeeID == request.Employee_id).ToList();
            if(shiftsIdOfOneEmployee.Any() == false)
            {
                if (checkForShiftID.Any() == true)
                {
                    if(checkEmployeeExist.Any() == true) 
                    {
                        var newEmpShift = new EmployeeShift();
                        newEmpShift.Employee_id = request.Employee_id;
                        newEmpShift.Shift_id = request.Shift_id;
                        _context.EmployeeShifts.Add(newEmpShift);
                        _context.SaveChanges();
                        return Ok(_context.EmployeeShifts.Where(shift => shift.Employee_id == request.Employee_id).ToList());
                    }
                    return BadRequest("Employee does not exist");

                }
                return BadRequest("the shift does not exist");
            }
            return BadRequest("the requested shift already assaigned to the chosen employee");
        }

        [HttpPost("EmployeeSearch/{name}")]

        public async Task<ActionResult<List<Employee>>> GetEmployeeByName(string name)
        {
            var searchEmployeeFname = _context.Employees.Where(emp => emp.FirstName == name).ToList();
            var searchEmployeeLname = _context.Employees.Where(emp => emp.LastName == name).ToList();
            var searchEmployeeDep = _context.Departments.Where(dep => dep.Name == name).ToList();
            if(searchEmployeeFname.Any() == true)
            {
                return Ok(searchEmployeeFname);
            }
            else if(searchEmployeeLname.Any() == true)
            {
                return Ok(searchEmployeeLname);
            }
            else if(searchEmployeeDep.Any() == true)
            {
                var searchResults = new List<Employee>();
                foreach(var dep in searchEmployeeDep)
                {
                    searchResults =  _context.Employees.Where(emp => emp.departmentID == dep.ID).ToList();
                    
                }
                return Ok(searchResults);
            }    
            return BadRequest("Employee does not exist");
        }

    }
}
