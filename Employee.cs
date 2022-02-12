using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FactoryWebsite.Models
{
    public class Employee
    {
        [Key]
        public int EmployeeID { get; set; }
        
        public List<EmployeeShift>? Employee_Shift_1 { get; set; }


        public string? FirstName { get; set; }
        [Required]
        public string? LastName { get; set;}
        public int? StartWorkYear { get; set; }

        [ForeignKey("Id")]
        public int? departmentID { get; set; }
        public Department? Department_1 { get; set; }
 

    }
}
