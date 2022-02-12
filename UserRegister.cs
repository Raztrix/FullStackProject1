using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace FactoryWebsite.Models
{
    [Index(nameof(UserName), IsUnique = true)]
    public class UserRegister
    {
        [Key]
        public int RegisterId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public int NumOfActions { get; set; }
    }
}
