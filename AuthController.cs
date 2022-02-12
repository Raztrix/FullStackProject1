using FactoryWebsite.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FactoryWebsite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepo;
        private readonly ApplicationDbContext _context;
        public AuthController(IAuthRepository authRepo, ApplicationDbContext context)
        {
            _authRepo = authRepo;
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegister request)
        {
            var response = await _authRepo.Register(
                new User
            {
                UserName = request.UserName,
                FullName = request.FullName,
                NumOfActions = request.NumOfActions,
            }, request.Password);

            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLogin request)
        {
            var response = await _authRepo.Login(request.UserName, request.Password);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }


        [HttpPost("identity")]
        // check the token for every page unfortunatelly without the digital signature only the claims bcause i cant understand it for now.
        public async Task<IActionResult> IdentityCheck(Token request)
        {
            try
            {
                var response = await _authRepo.IdentityCheck(request.token);
                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(false);
            }
        }

        [HttpPost("fullname")]
        // get the full name of a user for intruducing.
        public async Task<IActionResult> GetFullName(Token request)
        {
            var response = await _authRepo.FullNameFinder(request.token);
            if(response != null)
            {
                return Ok(response);
            }
            else
            {
                return BadRequest(response);
            }
            
        }

        [HttpPut("numOfActions/{userId}")]

        public async Task<ActionResult<int>> Decrease(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if(user != null)
            {
                if(user.NumOfActions > 0)
                {
                    user.NumOfActions -= 1;
                    await _context.SaveChangesAsync();
                    return Ok(user.NumOfActions);
                }
                return BadRequest("the number of actions is zero");
            }
            return BadRequest("user not found");
        }
    }
}
