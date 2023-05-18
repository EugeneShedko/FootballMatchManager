using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.DataBase.Models;
using FootballMatchManager.Enums;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FootballMatchManager.Controllers
{
    [Route("api/notification")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private UnitOfWork _unitOfWork;
        public NotificationController(UnitOfWork unitOfWork) 
        {
            this._unitOfWork = unitOfWork;
        }

        // -------------------------------------------------------------------------------------------------- //

        [HttpGet]
        [Route("user-notif")]
        public ActionResult GetAllUserNotif()
        {

            try
            {
                if (HttpContext.User == null) { return BadRequest(); }
                int userId;

                userId = int.Parse(HttpContext.User.Identity.Name);

                List<Notification> notifLst = _unitOfWork.NotificationRepository.GetUserNotification(userId);

                if (notifLst == null)
                {
                    return Ok();
                }
                else
                {
                    return Ok(notifLst);
                }

            }
            catch (Exception ex) 
            {
                return BadRequest();
            }
        }

        // -------------------------------------------------------------------------------------------------- /

        [HttpGet]
        [Route("user-notif-count")]
        public ActionResult GetNotifiCount(int userID)
        {
            try
            {
                if (HttpContext.User == null) { return BadRequest(); }

                int userId = int.Parse(HttpContext.User.Identity.Name);

                return Ok(_unitOfWork.NotificationRepository.GetUserNotReamNotifiCount(userId));

            }catch(Exception ex)
            {
                return BadRequest();
            }
        }

        // -------------------------------------------------------------------------------------------------- //

        /* Нужно что-то придумать с типом, так как метод получается не универсальным */
        /* Возможно вернуть все изменения назад */
        [HttpGet]
        [Route("sent-invit/{gameid}")]
        public ActionResult GetSendInvitation(int gameid)
        {
            List<Notification> notifications = _unitOfWork.NotificationRepository.GetSendRequest(gameid, "requesttoinvitegame");

            return Ok(notifications);
        }

        // -------------------------------------------------------------------------------------------------- //

        [HttpGet]
        [Route("sent-invit-team/{teamGameId}")]
        public ActionResult GetSendInvitationTeams(int teamGameId)
        {
            /* Получаю список уведомлений определенного типа, связанных с командным матчем */
            List<Notification> notifications = _unitOfWork.NotificationRepository.GetSendRequest(teamGameId, "requesttoinviteteamgame");

            /* Получаю список команд, которым отправлено уведолмние по списку организаторов */
            List<Team> notifiTeams = _unitOfWork.ApUserTeamRepository.GetTeamsByCreators(notifications.Select(n => n.Recipient).ToList());
            return Ok(notifiTeams);
        }

        // -------------------------------------------------------------------------------------------------- //

        [HttpPut]
        [Route("read-notifi")]
        public ActionResult ReadUserNotif()
        {

            if (HttpContext.User == null) { return BadRequest(); }

            int userId;
            int notifId;

            try
            {
                userId = int.Parse(HttpContext.User.Identity.Name);
                notifId = int.Parse(Request.Form["notifId"]);

                Notification notif = _unitOfWork.NotificationRepository.GetItem(notifId);

                if (notif == null) { return BadRequest(); }

                notif.Status = (int)NotificationEnum.Read;
                _unitOfWork.Save();

                List<Notification> notifLst = _unitOfWork.NotificationRepository.GetUserNotification(userId);


                if (notifLst == null)
                {
                    return Ok();
                }
                else
                {
                    return Ok(new {list = notifLst, count = notifLst.Where(n => n.Status == (int)NotificationEnum.NotRead).Count()});
                }

            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // -------------------------------------------------------------------------------------------------- //

    }
}
