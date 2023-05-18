using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.DataBase.Models;
using FootballMatchManager.Utilts;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FootballMatchManager.Controllers
{
    [Route("api/message/")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private UnitOfWork _unitOfWork;

        public MessageController(UnitOfWork unitOfWork)
        {
            this._unitOfWork = unitOfWork;
        }

        [HttpGet]
        [Route("entity-messages/{entityType}/{entityId}")]
        public ActionResult GetAllMessage(string entityType, int entityId)
        {

            List<Message> messages = _unitOfWork.MessageRepository.GetItems()
                                                                  .Where(m => m.EntityType == entityType
                                                                           && m.EntityId == entityId)
                                                                  .ToList();

            if (messages == null)
            {
                return Ok();
            }
            else
            {
                return Ok(JsonConverter.ConvertMessage(messages));
            }
        }

        [HttpDelete]
        [Route("delete-message/{messageId}")]
        public ActionResult DeleteMessage(int messageId)
        {
            try
            {
                Message deleteMessage = _unitOfWork.MessageRepository.GetItem(messageId);
                if(deleteMessage == null) { return BadRequest(new { message = "Сообщение не найдено" }); }

                _unitOfWork.MessageRepository.DeleteElement(messageId);
                _unitOfWork.Save();

                return Ok();
            }catch(Exception ex)
            {
                return BadRequest();
            }
        }
    }
}
