
using FactoryWebsite.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text.Json;

namespace FactoryWebsite.Data
{
    public class AuthRepository : IAuthRepository
    {

        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        public AuthRepository(ApplicationDbContext context, IConfiguration configuration)
        {
            _configuration = configuration;
            _context = context;
        }

        public async Task<ServiceResponse<string>> Login(string user_name, string password)
        {
            var response = new ServiceResponse<string>();
            var user = await _context.Users.FirstOrDefaultAsync(user => user.UserName.ToLower() == user_name.ToLower());
            if (user == null)
            {
                response.Success = false;
                response.Message = "User not found";
            }
            else if (!VeryfingPasswordHash(password, user.PasswordHash, user.PasswordSalt))
            {
                response.Success = false;
                response.Message = "Wrong password";
            }
            else
            {
                response.Success = true;
                response.Data = CreateToken(user);
            }
            return response;
        }

        public async Task<ServiceResponse<int>> Register(User user, string password)
        {
            if(await UserExist(user.UserName))
            {
                return new ServiceResponse<int>
                {
                    Success = false,
                    Message = "User already exist."
                };
            }
            CreatePasswordHash(password, out byte[] passwordHash, out byte[] passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;


            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return new ServiceResponse<int>
            {
                Data = user.Id,
                Message = "Registration Successful!",
                Success = true

            };
        }

        public async Task<bool> UserExist(string user_name)
        {
            if (await _context.Users.AnyAsync(user => user.UserName.ToLower() == user_name.ToLower()))
            {
                return true;
            }
            return false;
        }

        public async Task<bool> IdentityCheck(string jwtToken)
        {
            try {
                string firstClaimVal = ParseClaimsFromJwt(jwtToken).First().Value;
                bool IdentityUserNameCheck = await UserExist(firstClaimVal);

                if (jwtToken.IsNullOrEmpty())
                {
                    return false;
                }

                return IdentityUserNameCheck;
            }
            catch (Exception ex)// basically any exception should result in not identify user.
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }
        public async Task<string> FullNameFinder(string jwtToken)
        {
            try
            {
               string firstClaimVal = ParseClaimsFromJwt(jwtToken).First().Value;
               var user = _context.Users.Where(u => u.UserName == firstClaimVal).ToList().FirstOrDefault();
               if(user != null)
                {
                   string userFullName = user.FullName;
                   return userFullName;
                }
                return "Something went wrong";
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return "Error";
            }
        }

        // Using an algorithm for encrypting the passwords in the data base.
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                //compbine and encrypt the word i chose on the password and then make the sha512 combination on top of it
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VeryfingPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using(var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for(int i = 0; i < computedHash.Length; i++)
                {
                    if(computedHash[i] != passwordHash[i])
                    {
                        return false;
                    }
                }
                return true;
            }
        }
        private string CreateToken(User user)// token to be sent instead of creds for every time.
        {
            // the claims data that will be sent to the browser to identify the user in every state.
            List<Claim> Claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var token = new JwtSecurityToken(
                claims: Claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }


        // parse base64 string
        private byte[] PasrseBase64WithoutPadding(string base64)
        {
            switch(base64.Length % 4)
            {
                case 2: base64 += "=="; break;
                case 3: base64 += "="; break;

            }
            return Convert.FromBase64String(base64);
        }
        // parsing off the token
        private IEnumerable<Claim> ParseClaimsFromJwt(string jwt)
        {
            var payload = jwt.Split('.')[1];
            var jsonBytes = PasrseBase64WithoutPadding(payload);
            var keyValuePairs = JsonSerializer.Deserialize<Dictionary<string, object>>(jsonBytes);
            var Claims = keyValuePairs.Select(kvp => new Claim(kvp.Key, kvp.Value.ToString()));

            return Claims;

        }
    }
}
