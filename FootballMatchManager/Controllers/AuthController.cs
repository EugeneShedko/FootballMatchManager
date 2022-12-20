using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.DataBase.Models;
using FootballMatchManager.IncompleteModels;
using FootballMatchManager.Utilts;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

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
            var userExist = _unitOfWork.ApUserRepository.GetItems().FirstOrDefault(u => u.UserEmail == shortApUser.UserEmail);
            if (userExist != null)
            {
                return BadRequest(new { message = "Пользователь с такми email уже существует" });
            }

            MD5 md5 = MD5.Create();

            //Можно ли конструктор в класс добавить
            ApUser apUser = new ApUser()
            {
                UserEmail = shortApUser.UserEmail,
                UserPassword = Convert.ToBase64String(md5.ComputeHash(Encoding.UTF8.GetBytes(shortApUser.UserPassword))),
                UserRole = "user",
                UserFirstName = shortApUser.UserName,
                UserLastName = shortApUser.UserLastName,
                UserSex = shortApUser.UserSex,
                UserPosition = shortApUser.UserPosition,
                UserDateOfBirth = shortApUser.UserBirthDay,
                UserStatus = "active"
            };

            _unitOfWork.ApUserRepository.AddElement(apUser);
            _unitOfWork.Save();

            return Ok("Регистрация прошла успешно!");
        }

        [HttpPost]
        [Route("authorization")]
        public IActionResult PostAuth()
        {

            var userEmail = Request.Form["userEmail"];

            var loginUser = _unitOfWork.ApUserRepository.GetItems().FirstOrDefault(u => u.UserEmail == userEmail);

            if (loginUser == null)
            {
                return BadRequest(new { message = "Пользователя с таким email не существует" });
            }

            if (loginUser.UserStatus == "block")
            {
                return BadRequest(new {message = "Ваш аккаунт был заблокирован администратором"});
            }

            var userPassword = Request.Form["userPassword"];

            MD5 md5 = MD5.Create();

            string temp = Convert.ToBase64String(md5.ComputeHash(Encoding.UTF8.GetBytes(userPassword)));

            if (!string.Equals(loginUser.UserPassword, Convert.ToBase64String(md5.ComputeHash(Encoding.UTF8.GetBytes(userPassword)))))
            {
                return BadRequest(new { message = "Некорректный пароль" });
            }

            var jwt = _jwtService.GenerateToken(loginUser.ApUserId);
            Response.Cookies.Append("jwt", jwt, new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.None,
                Secure = true
            });

            return Ok(new { message = "Добро пожаловать!", user = loginUser});
        }

    }
}
