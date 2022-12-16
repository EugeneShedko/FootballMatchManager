using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.DataBase.Models;
using FootballMatchManager.Utilts;



namespace FootballMatchManager.Controllers
{
    [Route("api/profile/")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private UnitOfWork _unitOfWork;
        private JwtService _jwtService;
        public UserController(UnitOfWork unitOfWork, JwtService jwtService)
        {
            this._unitOfWork = unitOfWork;
            this._jwtService = jwtService;
        }

        [HttpGet]
        [Route("allplayers")]
        public ActionResult Get()
        {
            return Ok(_unitOfWork.ApUserRepository.GetItems().Where(u => u.UserRole != "system"));
        }

        [HttpPost]
        [Route("userprofile")]
        public ActionResult PostUserProfile()
        {
            var userId = int.Parse(Request.Form["userId"]);

            ApUser apuser = _unitOfWork.ApUserRepository.GetItem(userId);

            if(apuser == null) 
            {
                return BadRequest(new {message = "Пользователь не найден"});
            }
            else
            {
                return Ok(apuser);
            }
        }

    }
}
