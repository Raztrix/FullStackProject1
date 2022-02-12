using System.ComponentModel.DataAnnotations.Schema;

namespace FactoryWebsite.Models
{
    public class Department
    {
        public int ID { get; set; }
        public string? Name { get; set; }


        [ForeignKey("EmployeeID")]
        public int Manager { get; set; }


        public List<Employee>? EmployeesList { get; set; }
    }
}
