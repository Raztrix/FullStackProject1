using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FactoryWebsite.Models
{
    public class EmployeeShift
    {
        [Key]
        public int EsId { get; set; }

        [ForeignKey("EmployeeID")]
        public int Employee_id { get; set; }
        public Employee? Employee_1 { get; set; }


        [ForeignKey("ShiftId")]
        public int Shift_id { get; set; }
    }
}
