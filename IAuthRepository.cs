using FactoryWebsite.Models;

namespace FactoryWebsite.Data
{
    public interface IAuthRepository
    {
       Task<ServiceResponse<int>> Register(User user, string password);
       Task<ServiceResponse<string>> Login(string user_name, string password);
       Task<bool> UserExist(string user_name);
       Task<bool> IdentityCheck(string jwtToken);
       Task<string> FullNameFinder(string jwtToken);
    }
}
