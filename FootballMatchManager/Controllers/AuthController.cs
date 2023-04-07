using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.DataBase.Models;
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
        JwtService _jwtService;
        public AuthController(UnitOfWork unitOfWork, JwtService jwtService)
        {
            this._unitOfWork = unitOfWork;
            this._jwtService = jwtService;
        }

        [HttpPost]
        [Route("registration")]
        public IActionResult PostReg([FromBody] ShortApUser shortApUser)
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
                                       "active"
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
        [Route("authorization")]
        public async Task<IActionResult> PostAuth()
        {

            var userEmail = Request.Form["userEmail"];

            var loginUser = _unitOfWork.ApUserRepository.GetUserByEmail(userEmail);

            if (loginUser == null)
            {
                return BadRequest(new { message = "Пользователя с таким email не существует" });
            }

            if (loginUser.Status == "block")
            {
                return BadRequest(new {message = "Ваш аккаунт был заблокирован администратором"});
            }

            var userPassword = Request.Form["userPassword"];

            MD5 md5 = MD5.Create();

            string temp = Convert.ToBase64String(md5.ComputeHash(Encoding.UTF8.GetBytes(userPassword)));

            if (!string.Equals(loginUser.Password, Convert.ToBase64String(md5.ComputeHash(Encoding.UTF8.GetBytes(userPassword)))))
            {
                return BadRequest(new { message = "Некорректный пароль" });
            }

            var claims = new List<Claim> { new Claim(ClaimTypes.Name, Convert.ToString(loginUser.PkId))};
            ClaimsIdentity claimsIdentity = new ClaimsIdentity(claims, "Cookies");
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));

            return Ok(new { message = "Добро пожаловать!", user = loginUser });
        }

        // ------------------------------------------------------------------------------------ //

    }
}
