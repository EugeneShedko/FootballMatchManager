using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.DataBase.Models;
using FootballMatchManager.Utilts;
using FootballMatchManager.IncompleteModels;
using FootballMatchManager.AppDataBase.Models;
using FootballMatchManager.Enums;
using Microsoft.AspNetCore.SignalR;
using FootballMatchManager.Hubs;

namespace FootballMatchManager.Controllers
{
    [Route("api/profile/")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private UnitOfWork _unitOfWork;
        private IHubContext<NotificationHub> _notifications;

        public UserController(UnitOfWork unitOfWork,
                              IHubContext<NotificationHub> notofocation)
        {
            this._unitOfWork    = unitOfWork;
            this._notifications = notofocation;
        }

        // ------------------------------------------------------------------------------------------------------------------- //

        [HttpGet]
        [Route("all-players")]
        public ActionResult GetAllPlayers()
        {
            List<ApUser> apUsers =  _unitOfWork.ApUserRepository.GetAllUsers();

            if(apUsers == null)
                return BadRequest(new {message = "Нет зарегистрированных пользователей"});

            return Ok(apUsers);
        }

        // ------------------------------------------------------------------------------------------------------------------- //

        [HttpGet]
        [Route("all-players/{status}")]
        public ActionResult GetPlayersByStatus(string status)
        {
            try
            {

                List<ApUser> apUsers = _unitOfWork.ApUserRepository.GetUsersByStatus(status);

                return Ok(apUsers);

            }catch(Exception ex)
            {
                return BadRequest();
            }
        }

        // ------------------------------------------------------------------------------------------------------------------- //

        [HttpGet]
        [Route("player-position")]
        public ActionResult GetPlayerPosition()
        {
            List<Constant> positions = _unitOfWork.ConstantRepository.GetConstantsByGroup("position");
            return Ok(positions);

        }

        // ------------------------------------------------------------------------------------------------------------------- //

        [HttpGet]
        [Route("complain-reason")]
        public ActionResult GetComplainReason()
        {
            try
            {
                List<Constant> complainReason = _unitOfWork.ConstantRepository.GetConstantsByGroup("complain");
                return Ok(complainReason);

            }catch(Exception ex) 
            {
                return BadRequest();
            }
        }

        // ------------------------------------------------------------------------------------------------------------------- //

        [HttpGet]
        [Route("block-reason")]
        public ActionResult GetBlockReason()
        {
            try
            {
                List<Constant> blockReason = _unitOfWork.ConstantRepository.GetConstantsByGroup("blockReason");
                return Ok(blockReason);

            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // ------------------------------------------------------------------------------------------------------------------- //

        [HttpGet]
        [Route("user-complains/{userId}")]
        public ActionResult GetComplainReason(int userId)
        {
            try
            {

                List<Notification> complains = _unitOfWork.NotificationRepository.GetUserComplains(userId);

                return Ok(complains);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // ------------------------------------------------------------------------------------------------------------------- //

        [HttpGet]
        [Route("last-block/{userId}")]
        public ActionResult GetLastBlock(int userId)
        {
            try
            {
                BlockApUser userLastBlock = _unitOfWork.BlockApUserRepository.GetUserBlock(userId);

                return Ok(userLastBlock);

            }catch(Exception ex)
            {
                return BadRequest();
            }
        }

        // ------------------------------------------------------------------------------------------------------------------- //

        [HttpGet]
        [Route("all-blocks/{userId}")]
        public ActionResult GetUserBlocks(int userId)
        {
            try
            {
                List<BlockApUser> userBlocks = _unitOfWork.BlockApUserRepository.GetUserBlocks(userId);

                return Ok(userBlocks);

            }catch(Exception ex) 
            {
                return BadRequest();
            }
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

        // ------------------------------------------------------------------------------- //

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

        [HttpPost]
        [Route("block-user")]
        public ActionResult BlockUser([FromBody] ShortBlockApUser blockInfo)
        {
            if (HttpContext.User == null) { return BadRequest(); }

            string notfifMess       = "";
            string blockReason      = "";
            Constant notifiConstant = null;
            DateTime? endBlockDate  = null;

            ApUser apUser = _unitOfWork.ApUserRepository.GetItem(blockInfo.UserId);
            if(apUser == null) return BadRequest(new { message = "Пользователь не найден" });

            Constant blockConstant = _unitOfWork.ConstantRepository.GetItem(blockInfo.ReasonId);
            if(blockConstant == null) { return BadRequest(new {message = "Не найдена причина блокировки"}); }

            blockReason = blockConstant.StrValue;

            if (blockInfo.BlockPeriod == -1)
            {
                notifiConstant = _unitOfWork.ConstantRepository.GetConstantByName("BlockUserForever");
                if (notifiConstant != null)
                    notfifMess = notifiConstant.StrValue.Replace("{reazon}", blockConstant.StrValue); ;
            }
            else
            {
                endBlockDate = DateTime.Now.AddDays(blockInfo.BlockPeriod);
                notifiConstant = _unitOfWork.ConstantRepository.GetConstantByName("BlockUserTime");
                if (notifiConstant != null)
                    notfifMess = notifiConstant.StrValue.Replace("{date}", endBlockDate.ToString())
                                                        .Replace("{reazon}", blockConstant.StrValue);

            }

            if (blockConstant.Type == "game")
            {
                notfifMess  = notfifMess + " - " + blockInfo.GameName;
                blockReason = blockReason + " - " + blockInfo.GameName;
            }


            BlockApUser blockUser = new BlockApUser(endBlockDate, blockReason, blockInfo.UserId, notfifMess);
            /* Если -1, то пользователь заблокирован навсегда */
            apUser.Status = blockInfo.BlockPeriod == -1 ? ApUserGameType.UserStatusDeleted : ApUserGameType.UserStatusBlocked;

            _notifications.Clients.User(Convert.ToString(blockInfo.UserId)).SendAsync("blockUser", notfifMess);
            
            _unitOfWork.BlockApUserRepository.AddElement(blockUser);
            _unitOfWork.Save();

            return Ok(new {message = "Пользователь успешно заблокирован"});
        }

        // ------------------------------------------------------------------------------- //

        [HttpPost]
        [Route("complain-user")]
        public ActionResult ComplainUser([FromBody] ShortComplain complainInfo)
        {
            try
            {
                if (HttpContext.User == null) { return BadRequest(); }

                int userId = int.Parse(HttpContext.User.Identity.Name);
                Constant complainConstant = null;
                string complainMessage    = null;

                Constant reason = _unitOfWork.ConstantRepository.GetItem(complainInfo.ReasonId);
                if(reason == null) { return BadRequest(); }

                ApUser userSender = _unitOfWork.ApUserRepository.GetItem(userId);
                if(userSender == null) { return BadRequest(); }

                ApUser complainUser = _unitOfWork.ApUserRepository.GetItem(complainInfo.UserId);
                if(complainUser == null) { return BadRequest(); }

                ApUser admin = _unitOfWork.ApUserRepository.GetAdmin();
                if(admin == null) { return BadRequest(); }

                if (reason.Type == "game")
                {
                    complainConstant = _unitOfWork.ConstantRepository.GetConstantByName("gameComplain");
                   
                    if(complainConstant == null) { return BadRequest(); }
                    complainMessage = complainConstant.StrValue.Replace("{userSender}", userSender.FirstName + ' ' + userSender.LastName)
                                                               .Replace("{complainUser}", complainUser.FirstName + ' ' + complainUser.LastName)
                                                               .Replace("{reason}", reason.StrValue)
                                                               .Replace("{game}", complainInfo.GameName);
                }
                else
                {
                    complainConstant = _unitOfWork.ConstantRepository.GetConstantByName("justComplain");
                    if (complainConstant == null) { return BadRequest(); }
                    complainMessage = complainConstant.StrValue.Replace("{userSender}", userSender.FirstName + ' ' + userSender.LastName)
                                                               .Replace("{complainUser}", complainUser.FirstName + ' ' + complainUser.LastName)
                                                               .Replace("{reason}", reason.Type == "another" ? complainInfo.ReasonText : reason.StrValue);
                }

                Notification complain = new Notification(complainUser.PkId, reason.Group, complainMessage, complainUser.PkId, userSender.PkId);
                _unitOfWork.NotificationRepository.AddElement(complain);

                Notification complainNotifi = new Notification(admin.PkId, complainConstant.Type, complainMessage, userSender.PkId);
                _unitOfWork.NotificationRepository.AddElement(complainNotifi);
                _unitOfWork.Save();

                _notifications.Clients.User(Convert.ToString(admin.PkId)).SendAsync("displayNotifiInfo", complainMessage);

                return Ok(new { message = "Ваша жалоба отправлено администратору приложения" });

            }catch(Exception ex) 
            {
                return BadRequest();
            }
        }

        // ------------------------------------------------------------------------------- //

        [HttpPut]
        [Route("unblock-user/{userId}")]
        public ActionResult UnblockUser(int userId)
        {
            try
            {
                if (HttpContext.User == null) { return BadRequest(); }

                ApUser unblockUser = _unitOfWork.ApUserRepository.GetItem(userId);
                if(unblockUser == null) { return BadRequest(new {message = "Полльзователь не найден"} ); }

                unblockUser.Status = ApUserGameType.UserStatusActive;
                _unitOfWork.Save();

                return Ok(new {message = "Пользователь успешно разблокирован!", 
                               status = unblockUser.Status });
            }catch(Exception ex)
            {
                return BadRequest();
            }
        }

        // ------------------------------------------------------------------------------- //

        [HttpPost]
        [Route("update-stat/{userId}")]
        public ActionResult UpdateStatistic(int userId)
        {
            try
            {
                if (HttpContext.User == null) { return BadRequest();}

                ApUser updateUser = _unitOfWork.ApUserRepository.GetItem(userId);
                if(updateUser == null) { return BadRequest(new {log = "Пользователь не найден"}); }

                updateUser.GamesQnt   = int.Parse(Request.Form["GamesQnt"]);
                updateUser.GoalsQnt   = int.Parse(Request.Form["GoalsQnt"]);
                updateUser.AssistsQnt = int.Parse(Request.Form["AssistsQnt"]);
                _unitOfWork.Save();

                return Ok(new {message = "Статистика успешно обнолвена!", user = updateUser});

            }catch(Exception ex)
            {
                return BadRequest(new {message = "Ошибка обновления статистики"});
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

        // ------------------------------------------------------------------------------- //
    }
}
