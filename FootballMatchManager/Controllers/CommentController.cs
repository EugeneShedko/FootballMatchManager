using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.DataBase.Models;
using FootballMatchManager.Utilts;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FootballMatchManager.Controllers
{
    [Route("api/comment/")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private UnitOfWork _unitOfWork;
        private JwtService _jwtService;
        public CommentController(UnitOfWork unitOfWork, JwtService jwtService)
        {
            this._unitOfWork = unitOfWork;
            this._jwtService = jwtService;
        }

        // ------------------------------------------------------------------------- //

        [HttpGet]
        [Route("user-card-comment/{userId}")]
        public ActionResult GetAllComments(int userId)
        {
            List<Comment> comments = _unitOfWork.CommentRepository.GetItems()
                                                                  .Where(c => c.FkRecipientId == userId)
                                                                  .ToList();

            if (comments == null)
            {
                return Ok();
            }
            else
            {
                return Ok(JsonConverter.ConvertComment(comments));
            }
        }

        // ------------------------------------------------------------------------- //

    }
}
