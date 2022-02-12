using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FactoryWebsite.Models
{
    public class Shift
    {
        [Key]
        public int ShiftId { get; set; }
        [Required]

        public DateTime Date { get; set; }
        public int StartTime { get; set; }
        public int EndTime { get; set; }

    }
}
