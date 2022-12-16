using Microsoft.AspNetCore.Mvc;
using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.Utilts;
using FootballMatchManager.DataBase.Models;


namespace FootballMatchManager.Controllers.Admin
{
    [Route("api/admin/profile/")]
    [ApiController]
    public class AdminUserController : ControllerBase
    {

        private UnitOfWork _unitOfWork;
        private JwtService _jwtService;

        public AdminUserController(UnitOfWork unitOfWork, JwtService jwtService)
        {
            this._unitOfWork = unitOfWork;
            this._jwtService = jwtService;
        }

        [HttpGet]
        [Route("allusers")]
        public ActionResult GetAllUsers()
        {

            IEnumerable<ApUser> apUsers = _unitOfWork.ApUserRepository.GetItems().Where(u => u.UserRole != "system");  

            if(apUsers != null)
            {
                return Ok(apUsers);
            }
            else
            {
                return BadRequest(new {message = "Нет зарегистрированных пользователей"});
            }
        }

        [HttpGet]
        [Route("user/{id}")]
        public ActionResult GetUser(int id)
        {
            ApUser apUser = _unitOfWork.ApUserRepository.GetItem(id);

            if(apUser != null)
            {
                return Ok(apUser);
            }
            else
            {
                return BadRequest(new { message = "Пользователь не найден" });
            }
        }

        [HttpPost]
        [Route("makeadmin")]
        public ActionResult PostMakeAdmin()
        {
            var userId = int.Parse(Request.Form["userId"]);

            ApUser apUser = _unitOfWork.ApUserRepository.GetItem(userId);

            if(apUser == null) 
            {
                return BadRequest("Пользователя не существует");
            }

            apUser.UserRole = "admin";

            _unitOfWork.Save();

            return Ok(apUser);
        }

        [HttpPost]
        [Route("makeuser")]
        public ActionResult PostMakeUser()
        {
            var userId = int.Parse(Request.Form["userId"]);

            ApUser apUser = _unitOfWork.ApUserRepository.GetItem(userId);

            if (apUser == null)
            {
                return BadRequest("Пользователя не существует");
            }

            //Хорошо бы вынести значения в константы
            apUser.UserRole = "user";

            _unitOfWork.Save();

            return Ok(apUser);
        }

        //Можно свести в один метод
        [HttpPut]
        [Route("blockuser")]
        public ActionResult PutBlockUser()
        {
            var userId = int.Parse(Request.Form["userId"]);

            ApUser apUser = _unitOfWork.ApUserRepository.GetItem(userId);

            if (apUser == null)
            {
                return BadRequest("Пользователя не существует");
            }

            //Хорошо бы вынести значения в константы
            apUser.UserStatus = "block";

            _unitOfWork.Save();

            return Ok(apUser);
        }

        [HttpPut]
        [Route("unblockuser")]
        public ActionResult PutUnBlockUser()
        {
            var userId = int.Parse(Request.Form["userId"]);

            ApUser apUser = _unitOfWork.ApUserRepository.GetItem(userId);

            if (apUser == null)
            {
                return BadRequest("Пользователя не существует");
            }

            //Хорошо бы вынести значения в константы
            apUser.UserStatus = "active";

            _unitOfWork.Save();

            return Ok(apUser);
        }

        [HttpPut]
        [Route("updateuser")]
        public ActionResult PutUpdateUser()
        {
            var userId        = int.Parse(Request.Form["userId"]);
            var gamesNumber   = Request.Form["gamesNumber"];
            var goalsNumber   = Request.Form["goalsNumber"];
            var assistsNumber = Request.Form["goalsAssists"];

            ApUser apUser = _unitOfWork.ApUserRepository.GetItem(userId);

            if (apUser == null)
            {
                return BadRequest("Пользователя не существует");
            }

            apUser.GamesNumber = gamesNumber;
            apUser.GoalsNumber = goalsNumber;
            apUser.AssistsNumber = assistsNumber;

            _unitOfWork.Save();

            return Ok(apUser);
        }

        [HttpDelete]
        [Route("deleteuser/{id}")]
        public ActionResult DeleteUser(int id)
        {
 
            ApUser apUser = _unitOfWork.ApUserRepository.GetItem(id);

            if (apUser == null)
            {
                return BadRequest(new { message = "Пользователя не существует" });
            }

            _unitOfWork.ApUserRepository.DeleteElement(id);

            _unitOfWork.Save();

            IEnumerable<ApUser> apusers = _unitOfWork.ApUserRepository.GetItems();

            if(apusers == null)
            {
                return BadRequest( new { message = "Нет зарегистриорванных пользователей"});
            }
            else
            {
                return Ok(new { message = "Пользователь удален", users = apusers });
            }
        }
    }
}
