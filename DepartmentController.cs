using FactoryWebsite.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FactoryWebsite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : Controller
    {
        private readonly ApplicationDbContext _context;
        public DepartmentController(ApplicationDbContext context)
        {
            _context = context;
        }


        [HttpGet("departmentsInfo")]

        public async Task<IActionResult> GetData()
        {
            var data =  _context.Departments.ToList();
            if (data != null)
            {
                return Ok(data);
            }
            return BadRequest(data);    
        }
        
        [HttpPut("editDepartment")]

        public async Task<ActionResult<List<Department>>> EditDep(Department request)
        {
            var depDB = await _context.Departments.FindAsync(request.ID);
            if (depDB != null)
            {
                depDB.Name = request.Name;
                depDB.Manager = request.Manager;
                await _context.SaveChangesAsync();

                return Ok(await _context.Departments.ToListAsync());
            }
            return BadRequest("Department not exist");
        }

        [HttpDelete("{id}")]

        public async Task<ActionResult<List<Department>>> DeleteDepartment(int id)
        {
            var dbDepartment = await _context.Departments.FindAsync(id);
            if (dbDepartment != null)
            {
                _context.Departments.Remove(dbDepartment);
                await _context.SaveChangesAsync();
                return Ok(await _context.Departments.ToListAsync());
            }
            return BadRequest("Department Not Found");
        }

        [HttpPost("addDepartment")]

        public async Task<ActionResult<List<Department>>> AddDepartment(Department request)
        {
            var dbDepartment = await _context.Departments.FindAsync(request.ID);
            if(dbDepartment == null)
            {
                var newDep = new Department();
                newDep.ID = request.ID;
                newDep.Name = request.Name;
                newDep.Manager = request.Manager;
                _context.Departments.Add(newDep);
                await _context.SaveChangesAsync();
                return Ok(await _context.Departments.ToListAsync());
            }
            return BadRequest("Department already exist");
        }

        [HttpPost("{name}")]

        public async Task<ActionResult<int>> GetDepartment(string name)
        {
            var departmentDB = _context.Departments.Where(dep => dep.Name == name).FirstOrDefault();
            if(departmentDB == null)
            {
                return BadRequest("There is no Department");
            }
            return Ok(departmentDB.ID);
        }

        [HttpGet("departmentsNames")]

        public async Task<ActionResult<List<Department>>> GetDepartmentNames()
        {
            List<Department> depNames = new List<Department>();
            var data = _context.Departments.ToList();
            if (data != null)
            {
                foreach (var department in data)
                {
                    if(department != null)
                    {
                        depNames.Add(department);
                    }
                    
                }
                return Ok(depNames);
            }
            return BadRequest(depNames);
        }
    }

}
