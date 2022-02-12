using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace FactoryWebsite.Models
{
    [Index(nameof(UserName), IsUnique = true)]
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public int NumOfActions { get; set;}
    }
}
