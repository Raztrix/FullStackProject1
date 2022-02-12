using FactoryWebsite.Models;

namespace FactoryWebsite.Data
{
    public interface IDepRepository
    {
        Task<bool> DepExist(Department department);
        Task<Department> DepFinder(Department department);

    }
}
