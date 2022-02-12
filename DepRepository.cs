using FactoryWebsite.Models;
using Microsoft.EntityFrameworkCore;

namespace FactoryWebsite.Data
{
    public class DepRepository : IDepRepository
    {
        private readonly ApplicationDbContext _context;
        public DepRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<bool> DepExist(Department department)
        {
            if(await _context.Departments.AnyAsync(d => d.ID == department.ID))
            {
                return true;
            }
            return false;
        }

        public async Task<Department> DepFinder(Department department)
        {
            if(await _context.Departments.AnyAsync(d => d.ID == department.ID))
            {
                return department;
            }
            return null;
        }
    }
}
