using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.DataBase.Models;
using FootballMatchManager.Utilts;
using FootballMatchManager.IncompleteModels;

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

        // ------------------------------------------------------------------------------------------------------------------- //

        [HttpGet]
        [Route("all-players")]
        public ActionResult Get()
        {
            List<ApUser> apUsers =  _unitOfWork.ApUserRepository.GetItems()
                                                                .Where(u => u.Role != "system" && u.Status != "block")
                                                                .ToList();

            if(apUsers == null)
            {
                return BadRequest(new {message = "Нет зарегистрированных пользователей"});
            }

            return Ok(apUsers);
        }

        // ------------------------------------------------------------------------------------------------------------------- //

        [HttpPost]
        [Route("user-card")]
        public ActionResult PostUserProfile()
        {
            int userId;

            try
            {

                userId = int.Parse(Request.Form["userid"]);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }

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

        // ----------------------------------------------------------------------------------- //

        [HttpPost]
        [Route("editprofile")]
        public ActionResult PostEditProfile([FromBody] ShortApUser shortApUser)
        {
            ApUser apUser = _unitOfWork.ApUserRepository.GetItem(shortApUser.UserId);

            if(apUser == null)
            {
                return BadRequest(new { message = "Пользователя не существует" });
            }

            apUser.FirstName = shortApUser.UserName;
            apUser.LastName = shortApUser.UserLastName;
            apUser.Birth = shortApUser.UserBirthDay;
            apUser.Position = shortApUser.UserPosition;
            apUser.Email= shortApUser.UserEmail;

            _unitOfWork.Save();

            return Ok(new { message = "Данные успешно сохранены", askdata = apUser });
        }

        [HttpPost]
        [Route("addcomment")]
        public ActionResult PostAddComment()
        {
            Comment comment = new Comment()
            {
                Text = Request.Form["CommentText"],
                Date = DateTime.Now,
                FkRecipientId = int.Parse(Request.Form["CommentRecipient"]),
                FkSenderId = int.Parse(Request.Form["CommentSender"])
            };

            _unitOfWork.CommentRepository.AddElement(comment);

            _unitOfWork.Save();

            return Ok(comment);
        }

        // ------------------------------------------------------------------------------- //

        [HttpPost]
        [Route("add-prof-image")]
        public ActionResult PostAddProfImage()
        {
            try
            {
                var file = Request.Form.Files["image"];

                if (file == null)
                {
                    return BadRequest(new {message = "Картинка не загружена"});
                }

                var userId = int.Parse(Request.Form["userId"]);

                ApUser apUser = _unitOfWork.ApUserRepository.GetItem(userId);

                if(apUser == null)
                {
                    return BadRequest(new {message = "Пользователя не существует"});
                }

                string path = FileManager.LoadProfileImage(file, apUser.Email);

                apUser.Image = path;

                _unitOfWork.Save();

                return Ok(new { message = "Картинка успешно добавлена", curuser = apUser });
            }
            catch(Exception ex)
            {
                return BadRequest(new {messafe = "Ошибка загрузки картинки"});
            }
        }

        // ------------------------------------------------------------------------------- //

        [HttpDelete]
        [Route("deletecomment/{commentId}")]
        public ActionResult DeleteComment(int commentId)
        {
            _unitOfWork.CommentRepository.DeleteElement(commentId);

            _unitOfWork.Save();

            return Ok(new {message = "Комментарий успешно удален"});
        }
    }
}
