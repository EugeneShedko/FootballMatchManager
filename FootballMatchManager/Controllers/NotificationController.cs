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

            if (HttpContext.User == null) { return BadRequest(); }

            int userId;

            try
            {
                userId = int.Parse(HttpContext.User.Identity.Name);

            }catch(Exception ex) 
            {
                return BadRequest();
            }

            List<Notification> notifLst = _unitOfWork.NotificationRepository.GetUserNotification(userId);

            /*
            List<Notification> notif = _unitOfWork.NotificationRepository.GetItems()
                                                                         .Where(n => n.FkRecipient == userId)
                                                                         .OrderByDescending(n => n.Status)
                                                                         .OrderByDescending(n => n.Date)
                                                                         .ToList();

            */

            if (notifLst == null)
            {
                return Ok();
            }
            else
            {
                return Ok(notifLst);
            }
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

            }
            catch (Exception ex)
            {
                return BadRequest();
            }

            Notification notif = _unitOfWork.NotificationRepository.GetItem(notifId);

            if(notif == null) { return BadRequest(); }

            notif.Status = (int)NotificationEnum.Read;
            _unitOfWork.Save();

            List<Notification> notifLst = _unitOfWork.NotificationRepository.GetUserNotification(userId);

            /*
            List<Notification> notifLst = _unitOfWork.NotificationRepository.GetItems()
                                                                         .Where(n => n.FkRecipient == userId)
                                                                         .OrderByDescending(n => n.Status)
                                                                         .OrderByDescending(n => n.Date)
                                                                         .ToList();
            */

            if (notifLst == null)
            {
                return Ok();
            }
            else
            {
                return Ok(notifLst);
            }
        }



        // -------------------------------------------------------------------------------------------------- //

    }
}
