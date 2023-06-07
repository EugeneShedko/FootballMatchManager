using FootballMatchManager.Enums;
using FootballMatchManager.IncompleteModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using FootballMatchManager.Hubs;
using DataBaseManager.AppDataBase.UnitOfWorkPattern;
using DataBaseManager.AppDataBase.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FootballMatchManager.Controllers
{
    [Route("api/teamgame")]
    [ApiController]
    public class TeamGameController : ControllerBase
    {

        private UnitOfWork _unitOfWork;
        private IHubContext<NotificationHub> _notifications;
        private IHubContext<TeamGameHub> _teamGameHub;


        public TeamGameController(UnitOfWork unitOfWork, 
                                  IHubContext<NotificationHub> notofocation,
                                  IHubContext<TeamGameHub> teamGameHub)
        {
            this._unitOfWork    = unitOfWork;
            this._notifications = notofocation;
            this._teamGameHub   = teamGameHub;
        }

        // ------------------------------------------------------------------------------------ //

        [Route("all-team-games/{status}")]
        [HttpGet]
        public IActionResult GetTeamGames(int status)
        {
            try
            {
                if (HttpContext.User == null) { return BadRequest(); }

                List<TeamGame> allTeamGames = _unitOfWork.TeamGameRepasitory.GetTeamGamesByStatus(status);

                if (allTeamGames == null)
                    return Ok();
                else
                    return Ok(allTeamGames);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // ----------------------------------------------------------------------------------------------------------------------------------------- //
        [HttpGet]
        [Route("less-team-games/{status}")]
        public IActionResult GetTeamGamesLessStatus(int status)
        {
            try
            {
                if (HttpContext.User == null) { return BadRequest(); }

                List<TeamGame> allTeamGames = _unitOfWork.TeamGameRepasitory.GetTeamGamesLessStatus(status);
                return Ok(allTeamGames);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }

        }

        // ----------------------------------------------------------------------------------------------------------------------------------------- //

        [Route("user-team-games/{userId}")]
        [HttpGet]
        public IActionResult GetUserTeamGames(int userId)
        {
            try
            {
                if (HttpContext.User == null) { return BadRequest(); }

                List<TeamGame> allTeamGames = _unitOfWork.ApUserTeamGameRepasitory.GetPartUserTeamGames(userId);

                if (allTeamGames == null)
                    return Ok();
                else
                    return Ok(allTeamGames);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // ----------------------------------------------------------------------------------------------------------------------------------------- //
        [HttpGet]
        [Route("user-team-games/{userId}/{teamGameStatus}")]
        public ActionResult GetUserPartTeamGamesByGameStatus(int userId, int teamGameStatus)
        {
            try
            {
                if (HttpContext.User == null) { return BadRequest(); }

                List<TeamGame> userPartTeamGame = _unitOfWork.ApUserTeamGameRepasitory.GetUserPartTeamGamesByGameStatus(userId, teamGameStatus);

                return Ok(userPartTeamGame);

            }catch(Exception ex)
            {
                return BadRequest();
            }
        }

        // ----------------------------------------------------------------------------------------------------------------------------------------- //

        [Route("team-games-creat/{userId}")]
        [HttpGet]
        public IActionResult GetCreatorTeamGames(int userId)
        {
            try
            {
                if (HttpContext.User == null) { return BadRequest(); }

                List<TeamGame> allTeamGames = _unitOfWork.ApUserTeamGameRepasitory.GetCreatUserTeamGames(userId);

                if (allTeamGames == null)
                    return Ok();
                else
                    return Ok(allTeamGames);
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
                    return BadRequest();

                /* Проверка на завершенность матча */
                if(teamGame.Status < (int)TeamGameStatus.FINISHED && teamGame.DateTime < DateTime.Now)
                {
                    teamGame.Status = (int)TeamGameStatus.FINISHED;
                    _unitOfWork.Save();
                }

                /* Определяю, является ли запрашиваем пользователь участником матча */
                ApUserTeamGame userPart = _unitOfWork.ApUserTeamGameRepasitory.GetTeamGameParticiapnt(teamGame.PkId, userId);

                if (userPart != null)
                    isParticipant = true;

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
                   return Ok();
                else
                   return Ok(teamUsers);
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
                return Ok();
                else
                return Ok(gameEventTypes);
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
            try
            {
                if (HttpContext.User == null) { return BadRequest(); }

                int userId = int.Parse(HttpContext.User.Identity.Name);

                /* Получаю команду-организаор пользователя */
                Team teamCreator = _unitOfWork.ApUserTeamRepository.GetTeamByCreator(userId);
                if (teamCreator == null)
                    return BadRequest(new { message = "Вы не можете создать командный матч, так как не являетесь организатором ни одной команды" });
 
                /* Определяю минимальное количество участников матча команды */
                int minMembers = int.Parse(shortGame.GameFormat.Substring(0, 1));

                /* Проверяю достаточно ли участников в команде */
                if (teamCreator.MemberQnt < minMembers)
                    return BadRequest(new {message = "Вы не можете создать командный матч, так как в вашей команде не достаточно участников" });


                /* Создаю командный матч */
                TeamGame teamGame = new TeamGame(shortGame.GameName, 
                                                 shortGame.GameAdress, 
                                                 shortGame.GameDate.AddHours(3), 
                                                 shortGame.GameFormat, 
                                                 teamCreator.PkId);

                _unitOfWork.TeamGameRepasitory.AddElement(teamGame);
                _unitOfWork.Save();


                /* Добавляю записть организатора матча */
                ApUserTeamGame gameCreator = new ApUserTeamGame(teamGame.PkId, userId, (int)ApUserGameTypeEnum.CREATOR);
                _unitOfWork.ApUserTeamGameRepasitory.AddElement(gameCreator);
                _unitOfWork.Save();


                /* Получаю список участников команды организатора матча */
                List<ApUser> teamMembers = _unitOfWork.ApUserTeamRepository.GetTeamParticipants(teamCreator.PkId);
                for (int i = 0; i < teamMembers.Count; i++)
                {
                    ApUserTeamGame participant = new ApUserTeamGame(teamGame.PkId, teamMembers[i].PkId, (int)ApUserTeamEnum.PARTICIPANT);
                    _unitOfWork.ApUserTeamGameRepasitory.AddElement(participant);
                }
                _unitOfWork.Save();

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

        [Route("edit-teamgame")]
        [HttpPut]
        public async Task<ActionResult> PostEditTeamGame([FromBody] ShortGame shortGame)
        {
            if (HttpContext.User == null) { return BadRequest(); }

            int userId = int.Parse(HttpContext.User.Identity.Name);

            TeamGame teamGame = _unitOfWork.TeamGameRepasitory.GetItem(shortGame.GameId);

            if (teamGame == null) { return BadRequest();}

            teamGame.Name = shortGame.GameName;
            teamGame.Format = shortGame.GameFormat;
            teamGame.Adress = shortGame.GameAdress;

            if (teamGame.DateTime != shortGame.GameDate)
                teamGame.DateTime = shortGame.GameDate.AddHours(3);

            Constant constant = _unitOfWork.ConstantRepository.GetConstantByName("editgame");
            if (constant != null)
            {
                string notiffiMess = constant.StrValue.Replace("{game}", teamGame.Name);

                /* Отправляю уведомление пользователям участникам матча */
                List<ApUser> teamGameUsers = _unitOfWork.ApUserTeamGameRepasitory.GetTeamGameParticipants(shortGame.GameId);
                for (int i = 0; i < teamGameUsers.Count; i++)
                {
                    if (teamGameUsers[i].PkId == userId) { continue; }
                    await _notifications.Clients.User(Convert.ToString(teamGameUsers[i].PkId)).SendAsync("displayNotifi", notiffiMess);

                    Notification notification = new Notification(teamGameUsers[i].PkId, constant.Type, notiffiMess, teamGame.PkId, userId);
                    _unitOfWork.NotificationRepository.AddElement(notification);
                }

            }

            _unitOfWork.Save();

            return Ok(new { message = "Данные успешно сохранены" });
        }

        // ----------------------------------------------------------------------------------------------------------------------------------------- //

        [Route("leave-team-game/{teamgameId}")]
        [HttpDelete]
        public async Task<IActionResult> LeaveFromTeamGame(int teamgameId)
        {
            try
            {
                string notifiMess = null;
                if (HttpContext.User == null) { return BadRequest(); }

                int userId = int.Parse(HttpContext.User.Identity.Name);

                /* Получаю командный матч */
                TeamGame teamGame = _unitOfWork.TeamGameRepasitory.GetItem(teamgameId);
                if (teamGame == null) { return BadRequest(); }

                Team team = _unitOfWork.ApUserTeamRepository.GetTeamByCreator(userId);
                if (team == null) { return BadRequest(); }

                Constant notifiConstant = _unitOfWork.ConstantRepository.GetConstantByName("leaveteamgame");
                if (notifiConstant != null)
                    notifiMess = notifiConstant.StrValue.Replace("{team}", team.Name)
                                                        .Replace("{game}", teamGame.Name);

                List<ApUser> teamParticipants = _unitOfWork.ApUserTeamRepository.GetTeamParticipants(team.PkId);
                for (int j = 0; j < teamParticipants.Count; j++)
                {
                    ApUserTeamGame part = _unitOfWork.ApUserTeamGameRepasitory.GetTeamGameParticiapnt(teamgameId, teamParticipants[j].PkId);
                    if (part != null)
                    {
                        _unitOfWork.ApUserTeamGameRepasitory.DeleteElement(part);
                        if (notifiConstant != null)
                        {
                            await _notifications.Clients.User(Convert.ToString(teamParticipants[j].PkId)).SendAsync("displayNotifiError", notifiMess);
                            Notification notification = new Notification(teamParticipants[j].PkId, notifiConstant.Type, notifiMess, teamGame.PkId, userId);
                            _unitOfWork.NotificationRepository.AddElement(notification);
                        }
                        _teamGameHub.Clients.Group(Convert.ToString(teamGame.PkId)).SendAsync("refresh");
                    }
                }


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

        [Route("leave-team-game/{teamgameId}/{teamId}")]
        [HttpDelete]
        public async Task<IActionResult> LeaveFromTeamGame(int teamgameId, int teamId)
        {
            try
            {
                string notifiMess = null;
                if (HttpContext.User == null) { return BadRequest(); }

                int userId = int.Parse(HttpContext.User.Identity.Name);

                /* Получаю командный матч */
                TeamGame teamGame = _unitOfWork.TeamGameRepasitory.GetItem(teamgameId);
                if (teamGame == null) { return BadRequest(); }

                Team team = _unitOfWork.TeamRepository.GetItem(teamId);
                if (team == null) { return BadRequest(); }

                Constant notifiConstant = _unitOfWork.ConstantRepository.GetConstantByName("LeavTeamGameAdmin");
                if (notifiConstant != null)
                    notifiMess = notifiConstant.StrValue.Replace("{team}", team.Name)
                                                        .Replace("{game}", teamGame.Name);

                /* Список участников команды */
                List<ApUser> teamParticipants = _unitOfWork.ApUserTeamRepository.GetTeamParticipants(teamId);
                for (int j = 0; j < teamParticipants.Count; j++)
                {
                    ApUserTeamGame part = _unitOfWork.ApUserTeamGameRepasitory.GetTeamGameParticiapnt(teamgameId, teamParticipants[j].PkId);
                    if (part != null)
                    {
                        _unitOfWork.ApUserTeamGameRepasitory.DeleteElement(part);
                        if(notifiConstant != null)
                        {
                            await _notifications.Clients.User(Convert.ToString(teamParticipants[j].PkId)).SendAsync("displayNotifiError", notifiMess);
                            Notification notification = new Notification(teamParticipants[j].PkId, notifiConstant.Type, notifiMess, teamGame.PkId, userId);
                            _unitOfWork.NotificationRepository.AddElement(notification);
                        }
                        _teamGameHub.Clients.Group(Convert.ToString(teamGame.PkId)).SendAsync("refresh");
                    }
                }

                /* !!!! Плохо, что константой, хорошо бы вынести куда-нибудь */
                teamGame.FkSecondTeamId = 1;
                teamGame.Status = (int)TeamGameStatus.SEARCH;
                _unitOfWork.Save();

                return Ok(new { message = "Команда удалена из матча" });
            }
            catch
            {
                return BadRequest();
            }
        }

        // ----------------------------------------------------------------------------------------------------------------------------------------- //

        [Route("delete-team-game/{teamgameId}")]
        [HttpDelete]
        public async Task<ActionResult> DeleteGame(int teamgameId)
        {

            if (HttpContext.User == null) { return BadRequest(); }

            Constant constant  = null;
            string notiffiMess = null;
            int userId = int.Parse(HttpContext.User.Identity.Name);

            ApUser deletingUser = _unitOfWork.ApUserRepository.GetItem(userId);
            if (deletingUser == null) { return BadRequest(); }

            TeamGame teamGame = _unitOfWork.TeamGameRepasitory.GetItem(teamgameId);
            if (teamGame == null) { return BadRequest(); }

            List<ApUser> teamGameUsers = _unitOfWork.ApUserTeamGameRepasitory.GetTeamGameParticipants(teamgameId);

            _unitOfWork.TeamGameRepasitory.DeleteElement(teamgameId);
            _unitOfWork.Save();

            if (deletingUser.Role == "system")
               constant = _unitOfWork.ConstantRepository.GetConstantByName("DeleteTeamGameAdmin");
            else
               constant = _unitOfWork.ConstantRepository.GetConstantByName("deletegame");

            if (constant != null)
            {
                notiffiMess = constant.StrValue.Replace("{game}", teamGame.Name);
                /* Отправляю уведомление пользователям участникам матча */
                for (int i = 0; i < teamGameUsers.Count; i++)
                {
                    await _notifications.Clients.User(Convert.ToString(teamGameUsers[i].PkId)).SendAsync("displayNotifiError", notiffiMess);
                    _teamGameHub.Clients.Groups(Convert.ToString(teamGame.PkId)).SendAsync("deleteGame");
                    Notification notification = new Notification(teamGameUsers[i].PkId, constant.Type, notiffiMess, teamGame.PkId, userId);
                    _unitOfWork.NotificationRepository.AddElement(notification);
                }

            }

            return Ok();
        }
        // ----------------------------------------------------------------------------------------------------------------------------------------- //
    }
}
