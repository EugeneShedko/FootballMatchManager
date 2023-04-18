using FootballMatchManager.AppDataBase.Models;
using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.DataBase.Models;
using FootballMatchManager.Enums;
using FootballMatchManager.IncompleteModels;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FootballMatchManager.Controllers.Admin
{
    [Route("api/teamgame")]
    [ApiController]
    public class TeamGameController : ControllerBase
    {

        private UnitOfWork _unitOfWork;

        public TeamGameController(UnitOfWork unitOfWork)
        {
            this._unitOfWork = unitOfWork;
        }

        // ------------------------------------------------------------------------------------ //

        [Route("all-team-games")]
        [HttpGet]

        public IActionResult GetTeamGames()
        {
            try
            {
                if (HttpContext.User == null) { return BadRequest(); }

                List<TeamGame> allTeamGames = _unitOfWork.TeamGameRepasitory.GetAllTeamGames();

                if (allTeamGames == null)
                {
                    return Ok();
                }
                else
                {
                    return Ok(allTeamGames);
                }
            }
            catch(Exception ex)
            {
                return BadRequest();
            }
        }

        // ----------------------------------------------------------------------------------------------------------------------------------------- //
        
        [Route("team-game/{teamgameid}")]
        [HttpGet]
        public IActionResult GetTeamGameById(int teamGameId)
        {
            try
            {
                if (HttpContext.User == null) { return BadRequest(); }

                TeamGame teamGame = _unitOfWork.TeamGameRepasitory.GetItem(teamGameId);

                if(teamGame == null)
                {
                    return BadRequest();
                }

                return Ok(teamGame);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        // ----------------------------------------------------------------------------------------------------------------------------------------- //

        [Route("team-users/{teamgameid}")]
        [HttpGet]
        public IActionResult GetTeamUsers(int teamGameId)
        {
            try
            {
                if (HttpContext.User == null) { return BadRequest(); }

                List<ApUser> teamUsers = _unitOfWork.ApUserTeamRepository.GetTeamParticipants(teamGameId);

                if (teamUsers == null)
                {
                    return Ok();
                }
                else
                {
                    return Ok(teamUsers);
                }
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // ----------------------------------------------------------------------------------------------------------------------------------------- //

        [Route("create-team-game")]
        [HttpPost]
        public IActionResult PostCreateTeamGame([FromBody] ShortGame shortGame)
        {
            /* Проврека на то, хватает ли у пользователя человек в команде, для создания матча */
            try
            {
                if (HttpContext.User == null) { return BadRequest(); }

                int userId = int.Parse(HttpContext.User.Identity.Name);

                /* Получаю запись организатора команды */
                ApUserTeam teamCreator = _unitOfWork.ApUserTeamRepository.GetTeamCreatorByUserId(userId);

                if (teamCreator == null)
                {
                    return BadRequest(new { message = "Вы не можете создать командный матч, так как не являетесь организатором ни одной команды" });
                }

                /* Создаю командный матч */
                TeamGame teamGame = new TeamGame(shortGame.GameAdress, shortGame.GameDate, shortGame.GameFormat, teamCreator.PkFkTeamId);
                _unitOfWork.TeamGameRepasitory.AddElement(teamGame);
                _unitOfWork.Save();

                /* Добавить записи пользователей команды организатора матча */

                /* Добавляю записть организатора матча */
                ApUserTeamGame gameCreator = new ApUserTeamGame(teamGame.PkId, userId, (int)ApUserGameTypeEnum.CREATOR);
                _unitOfWork.ApUserTeamGameRepasitory.AddElement(gameCreator);

                return Ok(new { message = "Матч успешно создан!" });
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
    }
}
