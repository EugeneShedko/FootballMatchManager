using FootballMatchManager.AppDataBase.Models;
using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.DataBase.Models;
using FootballMatchManager.Enums;
using FootballMatchManager.IncompleteModels;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FootballMatchManager.Controllers
{
    [Route("api/teamgame")]
    [ApiController]
    public class TeamGameController : ControllerBase
    {

        private UnitOfWork _unitOfWork;

        public TeamGameController(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
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
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // ----------------------------------------------------------------------------------------------------------------------------------------- //

        [Route("user-team-games")]
        [HttpGet]
        public IActionResult GetUserTeamGames()
        {
            try
            {
                if (HttpContext.User == null) { return BadRequest(); }

                int userId = int.Parse(HttpContext.User.Identity.Name);

                List<TeamGame> allTeamGames = _unitOfWork.ApUserTeamGameRepasitory.GetPartUserTeamGames(userId);

                if (allTeamGames == null)
                {
                    return Ok();
                }
                else
                {
                    return Ok(allTeamGames);
                }
            }
            catch (Exception ex)
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

                int userId = int.Parse(HttpContext.User.Identity.Name);

                bool isParticipant = false;

                /* Получаю командную игру */
                TeamGame teamGame = _unitOfWork.TeamGameRepasitory.GetItem(teamGameId);
                if (teamGame == null)
                {
                    return BadRequest();
                }

                /* Проверка на завершенность матча */
                if(teamGame.Status < (int)TeamGameStatus.FINISHED && teamGame.DateTime < DateTime.Now)
                {
                    teamGame.Status = (int)TeamGameStatus.FINISHED;
                    _unitOfWork.Save();
                }

                /* Определяю, является ли запрашиваем пользователь участником матча */
                ApUserTeamGame userPart = _unitOfWork.ApUserTeamGameRepasitory.GetTeamGameParticiapnt(teamGame.PkId, userId);

                if (userPart != null)
                {
                    isParticipant = true;
                }

                /* Получаю организатора командной игры */
                ApUserTeamGame gameCratetor = _unitOfWork.ApUserTeamGameRepasitory.GetTeamGameCreatorRecord(teamGame.PkId);
                if (gameCratetor == null) { return BadRequest(); }

                /* Можно было бы вычитывать айди в переменную */
                if (teamGame.Status == (int)TeamGameStatus.WAIT)
                {
                    /* Нужно найти организатора второй команды */
                    ApUserTeam secTeamCreator = _unitOfWork.ApUserTeamRepository.GetTeamCreator(teamGame.SecondTeam.PkId);
                    if (secTeamCreator == null) { return BadRequest(); }

                    return Ok(new
                    {
                        game = teamGame,
                        creatorId = gameCratetor.PkFkUserId,
                        secTeamCreatorId = secTeamCreator.PkFkUserId,
                        isPart = isParticipant
                    });
                }
                else
                {
                    return Ok(new
                    {
                        game = teamGame,
                        creatorId = gameCratetor.PkFkUserId,
                        secTeamCreatorId = -1,
                        isPart = isParticipant
                    });
                }
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

        [Route("invite-team/{teamgameid}")]
        [HttpGet]
        public ActionResult GetInvitTeams(int teamgameid)
        {
            try
            {
                if (HttpContext.User == null) { return BadRequest(); }

                /* Получаю командный матч*/
                TeamGame teamGame = _unitOfWork.TeamGameRepasitory.GetItem(teamgameid);

                int minMembers = int.Parse(teamGame.Format.Substring(0, 1));

                /* Получаю список команд, у которых пользователей достаточное количество для участия в матче */
                List<Team> inviteTeams = _unitOfWork.TeamRepository.GetTeamsByPlayerCount(minMembers);
                
                inviteTeams.RemoveAll(team => team.PkId == teamGame.FkFirstTeamId);

                /* Удаляю команду организатора матча из списка команд на приглашение */
                return Ok(inviteTeams);

            }
            catch (Exception ex)
            {
                return BadRequest();
            }

            /* В матче хранится айди первой команды, можно удалить и вернуть коллекцию  */
            /* Вернуть список команд, у которых достаточное количество участников */
            /* Нужно еще как-то удалить команду организатора(где мне ее взять?) */
            return Ok();
        }

        // ----------------------------------------------------------------------------------------------------------------------------------------- //

        [Route("game-event-type")]
        [HttpGet]
        public IActionResult GetGameEventTypes()
        {
            try
            {
                if (HttpContext.User == null) { return BadRequest(); }

                /* Получаем список всех типов событий матча */
                List<GameEventType> gameEventTypes = _unitOfWork.GameEventTypeRepository.GetItems().ToList();
 
                if (gameEventTypes == null)
                {
                    return Ok();
                }
                else
                {
                    return Ok(gameEventTypes);
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

                /* Определяю минимальное количество участников матча команды */
                int minMembers = int.Parse(shortGame.GameFormat.Substring(0, 1));

                /* Проверяю достаточно ли участников в команде */
                if (teamCreator.Team.MemberQnt < minMembers)
                {
                    return BadRequest(new {message = "Вы не можете создать командный матч, так как в вашей команде не достаточно участников" });
                }


                /* Создаю командный матч */
                TeamGame teamGame = new TeamGame(shortGame.GameName, 
                                                 shortGame.GameAdress, 
                                                 shortGame.GameDate, 
                                                 shortGame.GameFormat, 
                                                 teamCreator.PkFkTeamId);

                _unitOfWork.TeamGameRepasitory.AddElement(teamGame);
                _unitOfWork.Save();


                /* Добавляю записть организатора матча */
                ApUserTeamGame gameCreator = new ApUserTeamGame(teamGame.PkId, userId, (int)ApUserGameTypeEnum.CREATOR);
                _unitOfWork.ApUserTeamGameRepasitory.AddElement(gameCreator);
                _unitOfWork.Save();


                /* Получаю список участников команды организатора матча */
                List<ApUser> teamMembers = _unitOfWork.ApUserTeamRepository.GetTeamParticipants(teamCreator.PkFkTeamId);
                for (int i = 0; i < teamMembers.Count; i++)
                {
                    ApUserTeamGame participant = new ApUserTeamGame(teamGame.PkId, teamMembers[i].PkId, (int)ApUserTeamEnum.PARTICIPANT);
                    _unitOfWork.ApUserTeamGameRepasitory.AddElement(participant);
                }

                return Ok(new { message = "Матч успешно создан!" });
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // ----------------------------------------------------------------------------------------------------------------------------------------- //

        [Route("add-to-teamgame")]
        [HttpPost]
        public IActionResult AddToTeamGame()
        {
            try
            {

                int teamGameId = int.Parse(Request.Form["teamGameId"]);
                int userId = int.Parse(Request.Form["userId"]);

                /* Получаем командрную игру к которой хочет присоединиться пользователь */
                TeamGame teamGame = _unitOfWork.TeamGameRepasitory.GetItem(teamGameId);

                if (teamGame == null) { return BadRequest(); }

                if (teamGame.Status != (int)TeamGameStatus.SEARCH)
                {
                    return BadRequest(new { message = "В матче уже учавствуют две команды" });
                }

                /* Получаю минимальное количество участников в матче */
                int minMembers = int.Parse(teamGame.Format.Substring(0, 1));

                /* Получаю команду пользователя */
                Team teamCreator = _unitOfWork.ApUserTeamRepository.GetTeamByCreator(userId);
                if (teamCreator == null) { return BadRequest(); }

                if (teamCreator.MemberQnt < minMembers)
                {
                    return BadRequest(new { message = "Недостаточное количество участников в команде для присоединения к матче" });
                }

                /* Добавляю команду к матчу */
                teamGame.FkSecondTeamId = teamCreator.PkId;
                teamGame.Status = (int)TeamGameStatus.WAIT;

                /* Получаю участников первой команды */
                List<ApUser> firstTeamMembers = _unitOfWork.ApUserTeamRepository.GetTeamParticipants(teamGame.FkFirstTeamId);
                /* Получаю участников второй команды */
                List<ApUser> secondTeamMembers = _unitOfWork.ApUserTeamRepository.GetTeamParticipants(teamGame.FkSecondTeamId);
                /* Удаляю повторяюшихся игроков, так как они уже добавлены на командный матч */
                secondTeamMembers.RemoveAll(member2 => firstTeamMembers.Any(member1 => member1.PkId == member2.PkId));

                /* Добавляю участников второй команды к мат */
                for (int i = 0; i < secondTeamMembers.Count; i++)
                {
                    ApUserTeamGame participant = new ApUserTeamGame(teamGame.PkId, secondTeamMembers[i].PkId, (int)ApUserTeamEnum.PARTICIPANT);
                    _unitOfWork.ApUserTeamGameRepasitory.AddElement(participant);
                }

                _unitOfWork.Save();

                return Ok();

            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // ----------------------------------------------------------------------------------------------------------------------------------------- //

        [Route("leave-team-game/{teamgameId}")]
        [HttpDelete]
        public IActionResult LeaveFromTeamGame(int teamgameId)
        {
            try
            {
                if (HttpContext.User == null) { return BadRequest(); }

                int userId = int.Parse(HttpContext.User.Identity.Name);

                /* Получаю командный матча */
                TeamGame teamGame = _unitOfWork.TeamGameRepasitory.GetItem(teamgameId);
                if (teamGame == null) { return BadRequest(); }

                /* !!!!! Возможно потом еще придется удалять пользователей */

                /* !!!! Плохо, что константой, хорошо бы вынести куда-нибудь */
                teamGame.FkSecondTeamId = 1;
                teamGame.Status = (int)TeamGameStatus.SEARCH;
                _unitOfWork.Save();

                return Ok(new { message = "Ваша команда покинула матча" });
            }
            catch
            {
                return BadRequest();
            }
        }
        // ----------------------------------------------------------------------------------------------------------------------------------------- //
    }
}
