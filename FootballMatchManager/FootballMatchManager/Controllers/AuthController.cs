using DataBaseManager.AppDataBase.Models;
using DataBaseManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.Enums;
using FootballMatchManager.IncompleteModels;
using FootballMatchManager.Utilts;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace FootballMatchManager.Controllers
{
    [Route("api/auth/")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        UnitOfWork _unitOfWork;
        public AuthController(UnitOfWork unitOfWork)
        {
            this._unitOfWork = unitOfWork;
        }

        [HttpPost]
        [Route("registration")]
        public IActionResult Registration([FromBody] ShortApUser shortApUser)
        {
            var userExist = _unitOfWork.ApUserRepository.GetUserByEmail(shortApUser.UserEmail);

            if (userExist != null)
            {
                return BadRequest(new { message = "Пользователь с такми email уже существует" });
            }

            MD5 md5 = MD5.Create();

            ApUser apUser = new ApUser(shortApUser.UserEmail,
                                       Convert.ToBase64String(md5.ComputeHash(Encoding.UTF8.GetBytes(shortApUser.UserPassword))),
                                       "user",
                                       shortApUser.UserName,
                                       shortApUser.UserLastName,
                                       shortApUser.UserSex,
                                       shortApUser.UserPosition,
                                       shortApUser.UserBirthDay,
                                       /* В этом классе хранятся строковые константы */
                                       ApUserGameType.UserStatusActive
                                       );

            _unitOfWork.ApUserRepository.AddElement(apUser);
            _unitOfWork.Save();

            Directory.CreateDirectory("wwwroot/" + Convert.ToBase64String(
                                                   md5.ComputeHash(
                                                   Encoding.UTF8.GetBytes(apUser.Email))));

            return Ok("Регистрация прошла успешно!");
        }

        // ------------------------------------------------------------------------------------ //

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Authorisation()
        {

            var userEmail    = Request.Form["userEmail"];
            var userPassword = Request.Form["userPassword"];
            var loginUser    = _unitOfWork.ApUserRepository.GetUserByEmail(userEmail);

            if (loginUser == null)
                return BadRequest(new { message = "Пользователя с таким email не существует" });

            if (loginUser.Status == ApUserGameType.UserStatusBlocked || loginUser.Status == ApUserGameType.UserStatusDeleted)
            {

                BlockApUser block = _unitOfWork.BlockApUserRepository.GetUserBlock(loginUser.PkId);

                if(block != null)
                {
                    if (loginUser.Status == ApUserGameType.UserStatusDeleted)
                        return BadRequest(new { message = block.Message });

                    if (block.EndBlockingDate < DateTime.Now)
                    {
                        loginUser.Status = ApUserGameType.UserStatusActive;
                        _unitOfWork.Save();
                    }
                    else
                        return BadRequest(new { message = block.Message });
                }

            }

            MD5 md5 = MD5.Create();

            if (!string.Equals(loginUser.Password, Convert.ToBase64String(md5.ComputeHash(Encoding.UTF8.GetBytes(userPassword)))))
                return BadRequest(new { message = "Некорректный пароль" });

            var claims = new List<Claim> { new Claim(ClaimTypes.Name, Convert.ToString(loginUser.PkId))};
            ClaimsIdentity claimsIdentity = new ClaimsIdentity(claims, "Cookies");
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));

            return Ok(new { message = "Добро пожаловать!", user = loginUser });
        }

        // ------------------------------------------------------------------------------------ //

    }
}
