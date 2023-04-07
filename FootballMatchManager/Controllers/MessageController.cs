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
        private JwtService _jwtService;

        public MessageController(UnitOfWork unitOfWork, JwtService jwtService)
        {
            this._unitOfWork = unitOfWork;
            this._jwtService = jwtService;
        }

        [HttpGet]
        [Route("game-messages/{gameId}")]
        public ActionResult GetAllComments(int gameId)
        {

            List<Message> messages = _unitOfWork.MessageRepository.GetItems()
                                                                  .Where(m => m.FkGameId == gameId)
                                                                  .ToList();

            if (messages == null)
            {
                return Ok();
            }
            else
            {
                return Ok(messages);
            }
        }

    }
}
