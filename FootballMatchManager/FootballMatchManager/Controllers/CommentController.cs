using DataBaseManager.AppDataBase.Models;
using DataBaseManager.AppDataBase.UnitOfWorkPattern;
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
        public CommentController(UnitOfWork unitOfWork)
        {
            this._unitOfWork = unitOfWork;
        }

        // ------------------------------------------------------------------------- //

        [HttpGet]
        [Route("user-card-comment/{userId}")]
        public ActionResult GetAllComments(int userId)
        {
            List<Comment> comments = _unitOfWork.CommentRepository.GetUserComments(userId);

            if (comments == null)
                return Ok();
            else
                return Ok(JsonConverter.ConvertComment(comments));
        }

        // ------------------------------------------------------------------------- //

        [HttpDelete]
        [Route("delete-comment/{commentId}")]
        public ActionResult DeleteComment(int commentId)
        {
            try
            {
                _unitOfWork.CommentRepository.DeleteElement(commentId);
                _unitOfWork.Save();

                return Ok();
            }
            catch(Exception ex)
            {
                return BadRequest();
            }
        }
    }
}
