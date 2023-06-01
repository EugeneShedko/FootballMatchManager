using FootballMatchManager.AppDataBase.Models;
using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.DataBase.Models;
using FootballMatchManager.Enums;
using FootballMatchManager.IncompleteModels;
using FootballMatchManager.Utilts;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.SignalR;
using FootballMatchManager.Hubs;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FootballMatchManager.Controllers
{
    [Route("api/team/")]
    [ApiController]
    public class TeamController : ControllerBase
    {
        private UnitOfWork _unitOfWork;
        private IHubContext<NotificationHub> _notifications;
        private IHubContext<TeamGameHub> _teamGameHub;
        private IHubContext<TeamHub> _teamHub;

        public TeamController(UnitOfWork unitOfWork, 
                              IHubContext<NotificationHub> notofocation,
                              IHubContext<TeamGameHub> teamGameHub,
                              IHubContext<TeamHub> teamHub
                              )
        {
            this._unitOfWork    = unitOfWork;
            this._notifications = notofocation;
            this._teamGameHub   = teamGameHub;
            this._teamHub       = teamHub;
        }

        // ------------------------------------------------------------------------------------------------------ //

        [Route("get-all-tems")]
        [HttpGet]
        public IActionResult Get()
        {
            IEnumerable<Team> teams = _unitOfWork.TeamRepository.GetAllTeams();

            if (teams == null)
            {
                return Ok();
            }
            else
            {
                return Ok(teams);
            }
        }

        // ------------------------------------------------------------------------------------------------------ //

        [Route("create-team")]
        [HttpPost]
        public IActionResult Post()
        {
            try
            {
                string teamName = Request.Form["teamName"];

                if (HttpContext.User == null) { return BadRequest(); }

                int userCreatorId = int.Parse(HttpContext.User.Identity.Name);

                if (_unitOfWork.ApUserTeamRepository.GetTeamByCreator(userCreatorId) != null)
                    return BadRequest("Невозможно создать команду, так как вы уже являетесь организатором команды.");

                if (_unitOfWork.TeamRepository.GetTeamByName(teamName) != null) 
                    return BadRequest("Команда с таким наименованием уже существует"); 

                var imageFile = Request.Form.Files["teamImage"];

                /* Создаем команду */
                Team team = new Team(teamName, Request.Form["teamDesk"]);

                /* Создаем папку для команды на сервере */
                MD5 md5 = MD5.Create();
                Directory.CreateDirectory("wwwroot/teams/" + Convert.ToBase64String(
                                                       md5.ComputeHash(
                                                       Encoding.UTF8.GetBytes(team.Name + team.CrtDate.ToString()))).Replace("/", ""));

                /* Устанавливаем картинку команде */
                if (imageFile != null)
                {
                    team.Image = FileManager.LoadTeamImage(imageFile, team.Name + team.CrtDate.ToString());
                }

                _unitOfWork.TeamRepository.AddElement(team);
                _unitOfWork.Save();

                ApUserTeam apUserTeamCr = new ApUserTeam(team.PkId, userCreatorId, (int)ApUserTeamEnum.CREATOR);
                ApUserTeam apUserTeamPt = new ApUserTeam(team.PkId, userCreatorId, (int)ApUserTeamEnum.PARTICIPANT);

                _unitOfWork.ApUserTeamRepository.AddElement(apUserTeamCr);
                _unitOfWork.ApUserTeamRepository.AddElement(apUserTeamPt);
                _unitOfWork.Save();

                List<Team> allTeams = _unitOfWork.TeamRepository.GetAllTeams();

                return Ok(allTeams);

            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // ------------------------------------------------------------------------------------------------------ //

        [Route("team/{teamid}")]
        [HttpGet]
        public IActionResult TeamProfile(int teamId)
        {
            
            try
            {

                if (HttpContext.User == null) { return BadRequest(); }

                int userId = int.Parse(HttpContext.User.Identity.Name);
                int teamCreatorId = -1;
                bool isParticipant = false;
                bool isCreator     = false;

                Team team = _unitOfWork.TeamRepository.GetItem(teamId);

                if (team == null)
                    return BadRequest();

                ApUserTeam apUserTeamPt = _unitOfWork.ApUserTeamRepository.GetTeamParticipant(team.PkId, userId);

                if (apUserTeamPt != null)
                    isParticipant = true;

                ApUserTeam teamCreator = _unitOfWork.ApUserTeamRepository.GetTeamCreator(teamId);

                if (teamCreator != null)
                {
                    teamCreatorId = teamCreator.PkFkUserId;
                    if(userId == teamCreator.PkFkUserId)
                      isCreator = true;
                }

                return Ok(new { currteam = team, 
                                isPart = isParticipant, 
                                isCreat = isCreator,
                                creatorId = teamCreatorId
                });
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // ------------------------------------------------------------------------------------------------------ //

        [Route("user-team")]
        [HttpGet]
        public IActionResult UserTeamProfile()
        {

            try
            {
                if (HttpContext.User == null) { return BadRequest(); }

                int userId = int.Parse(HttpContext.User.Identity.Name);
                Team team;
                /* Идинтификаторы команд, в которых пользователь является участником */
                List<Team> userParticipantTeamsId;

                /* Организатор всегда должен являться участником команды */
                /* Пытаюсь найти команду, в которой пользователь является организатором */
                team = _unitOfWork.ApUserTeamRepository.GetTeamByCreator(userId);

                /* Если есть такая команда сразу возвращаю ее идентификатор */
                if(team != null) 
                {
                    userParticipantTeamsId = _unitOfWork.ApUserTeamRepository.GetTeamsByParticipant(userId);
                    return Ok(new { firstTeamId = team.PkId, teamsPart = userParticipantTeamsId});
                }

                /* Пытаюсь найти команду, в которой пользователь является участником */
                team = _unitOfWork.ApUserTeamRepository.GetTeamByParticipant(userId);

                /* Если есть такая команда сразу возвращаю ее идентификатор */
                if (team != null) 
                {
                    userParticipantTeamsId = _unitOfWork.ApUserTeamRepository.GetTeamsByParticipant(userId);
                    return Ok(new { firstTeamId = team.PkId, teamsPart = userParticipantTeamsId});
                }

                /* Пока что не понятно, что передавать в количестве участников, если пользователь не является */
                /* участником ни одной команды*/
                return Ok(new { firstTeamId  = -1});
            }
            catch(Exception ex)
            {
                return BadRequest();
            }
        }

        // ------------------------------------------------------------------------------------------------------ //

        [HttpGet]
        [Route("team-users/{teamId}")]
        public ActionResult GetTeamUser(int teamId)
        {
            List<ApUser> teamUsers = _unitOfWork.ApUserTeamRepository.GetTeamParticipants(teamId);

            if (teamUsers.Count == 0)
            {
               return Ok();
            }
            else
            {
                return Ok(teamUsers);
            }
        }

        // ------------------------------------------------------------------------------------------------------ //

        [Route("add-to-team")]
        [HttpPost]
        public IActionResult AddToTeam()
        {

           try
           {

                int teamId = int.Parse(Request.Form["teamId"]);
                int userId = int.Parse(Request.Form["userId"]);

                if (_unitOfWork.ApUserTeamRepository.GetTeamsByParticipant(userId).Count >= 3)
                {
                    return BadRequest(new {message = "Невозможно присоединить пользователя к команде, так как он уже является участником 3 команд."});
                }

                Team team = _unitOfWork.TeamRepository.GetItem(teamId);
                if(team == null) { return BadRequest(); }

                ApUserTeam apUserTeamEx = _unitOfWork.ApUserTeamRepository.GetTeamParticipant(teamId, userId);

                if (apUserTeamEx != null)
                {
                    return BadRequest();
                }

                ApUserTeam apUserTeam = new ApUserTeam(teamId, userId, (int)ApUserTeamEnum.PARTICIPANT);

                _unitOfWork.ApUserTeamRepository.AddElement(apUserTeam);
                team.MemberQnt = team.MemberQnt + 1;
                _unitOfWork.Save();

                List<ApUser> apUsers = _unitOfWork.ApUserTeamRepository.GetTeamParticipants(teamId);

                if (apUsers.Count == 0)
                {
                    return Ok(new { message = "Вы присоеденились к команде", currteam = team });
                }
                else
                {
                    return Ok(new { message = "Вы присоеденились к команде", users = apUsers, currteam = team });
                }

            }
            catch (Exception ex) 
           { 
                return BadRequest();
           }

}

        // ------------------------------------------------------------------------------------------------------ //

        [Route("edit-team")]
        [HttpPost]
        public IActionResult EditTeamInfo()
        {
            try
            {
                int teamId = int.Parse(Request.Form["teamId"]);
                string teamName = Request.Form["teamName"];
                string description = Request.Form["teamDesk"];

                if (HttpContext.User == null) { return BadRequest(); }

                int userCreatorId = int.Parse(HttpContext.User.Identity.Name);

                Team execTeam = _unitOfWork.TeamRepository.GetTeamByName(teamName);
                if (execTeam != null && execTeam.PkId != teamId)
                {
                    return BadRequest("Команда с таким наименованием уже существует");
                }

                Team editTeam = _unitOfWork.TeamRepository.GetItem(teamId);
                if(editTeam == null) { return BadRequest(); }

                var imageFile = Request.Form.Files["teamImage"];
                if (imageFile != null)
                {
                    editTeam.Image = FileManager.LoadTeamImage(imageFile, editTeam.Name);
                }

                editTeam.Name = teamName;
                editTeam.Description = description;
                _unitOfWork.Save();

                return Ok(new {message = "Информация успешно обновлена!"});

            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // ------------------------------------------------------------------------------------------------------ //

        [HttpDelete]
        [Route("leave-from-team/{teamId}")]
        public ActionResult LeaveFromTeam(int teamId)
        {
            try
            {
                if (HttpContext.User == null) { return BadRequest(); }

                int userId = int.Parse(HttpContext.User.Identity.Name);

                Team team = _unitOfWork.TeamRepository.GetItem(teamId);

                if (team == null) { return BadRequest(); }

                ApUserTeam userCreat = _unitOfWork.ApUserTeamRepository.GetTeamCreator(teamId, userId);

                if(userCreat != null)
                {
                    return BadRequest(new {message = "Не возможно покинуть команду, так как вы являетесь организатором."});
                }

                /* Получаем записи командных матчей, в которых команда является организатором */
                List<TeamGame> teamGames = _unitOfWork.TeamGameRepasitory.GetMatchesByCreatorTeam(teamId, (int)TeamGameStatus.WAIT);
                /* Удаляем пользователя из этих матчей */
                for (int i = 0; i < teamGames.Count; i++)
                {
                    ApUserTeamGame record = _unitOfWork.ApUserTeamGameRepasitory.GetTeamGameParticiapnt(teamGames[i].PkId, userId);
                    _unitOfWork.ApUserTeamGameRepasitory.DeleteElement(record);
                }

                /* Получаем записи командных матчей, в которых команда является участницей */
                List<TeamGame> teamGamesPart = _unitOfWork.TeamGameRepasitory.GetMatchesByParticipantTeam(teamId, (int)TeamGameStatus.WAIT);
                /* Удаляем пользователя из этих матчей */
                for (int i = 0; i < teamGamesPart.Count; i++)
                {
                    ApUserTeamGame record = _unitOfWork.ApUserTeamGameRepasitory.GetTeamGameParticiapnt(teamGamesPart[i].PkId, userId);
                    _unitOfWork.ApUserTeamGameRepasitory.DeleteElement(record);
                }

                /* Получаем запись пользователя участника команды */
                ApUserTeam userPart = _unitOfWork.ApUserTeamRepository.GetTeamParticipant(teamId, userId);

                /* Проверка на то, дейсвительно ли он является участником */
                if(userPart == null) { return BadRequest(); }

                /* Удаляем пользователя из команды */
                _unitOfWork.ApUserTeamRepository.DeleteElement(userPart);
                /* Уменьшаю количество участников в комнде */
                if(team.MemberQnt > 0)
                {
                    team.MemberQnt = team.MemberQnt - 1;
                }
                _unitOfWork.Save();

                /* Получаем обновленный список пользователей команды */
                List<ApUser> teamUsers = _unitOfWork.ApUserTeamRepository.GetTeamParticipants(teamId);

                if (teamUsers == null)
                {
                    return Ok(new { message = "Вы покинули команду"});
                }
                else
                {
                    return Ok(new { message = "Вы покинули команду", users = teamUsers, });
                }
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // ------------------------------------------------------------------------------------------------------ //

        [HttpDelete]
        [Route("delete-team-user/{teamId}/{deleteUserId}")]
        public ActionResult DeleteUserFromTeam(int teamId, int deleteUserId)
        {
            try
            {
                if (HttpContext.User == null) { return BadRequest(); }

                DataBase.Models.Constant notifiConstant = null;
                int deletingUserId = int.Parse(HttpContext.User.Identity.Name);

                Team team = _unitOfWork.TeamRepository.GetItem(teamId);
                if (team == null) { return BadRequest(); }

                /* Проверка на организатора */
                ApUserTeam userCreat = _unitOfWork.ApUserTeamRepository.GetTeamCreator(teamId, deleteUserId);
                if (userCreat != null)
                {
                    return BadRequest(new { message = "Не возможно покинуть команду, так как вы являетесь организатором." });
                }

                /* Получаем записи командных матчей, в которых команда является организатором */
                List<TeamGame> teamGames = _unitOfWork.TeamGameRepasitory.GetMatchesByCreatorTeam(teamId, (int)TeamGameStatus.WAIT);
                /* Удаляем пользователя из этих матчей */
                for(int i = 0; i < teamGames.Count; i++)
                {
                    ApUserTeamGame record = _unitOfWork.ApUserTeamGameRepasitory.GetTeamGameParticiapnt(teamGames[i].PkId, deleteUserId);
                    _unitOfWork.ApUserTeamGameRepasitory.DeleteElement(record);
                }

                /* Получаем записи командных матчей, в которых команда является участницей */
                List<TeamGame> teamGamesPart = _unitOfWork.TeamGameRepasitory.GetMatchesByParticipantTeam(teamId, (int)TeamGameStatus.WAIT);
                /* Удаляем пользователя из этих матчей */
                for (int i = 0; i < teamGamesPart.Count; i++)
                {
                    ApUserTeamGame record = _unitOfWork.ApUserTeamGameRepasitory.GetTeamGameParticiapnt(teamGamesPart[i].PkId, deleteUserId);
                    _unitOfWork.ApUserTeamGameRepasitory.DeleteElement(record);
                }

                /* Получаем запись пользователя участника команды */
                ApUserTeam userPart = _unitOfWork.ApUserTeamRepository.GetTeamParticipant(teamId, deleteUserId);
                if (userPart == null) { return BadRequest(); }

                /* Удаляем пользователя из команды */
                _unitOfWork.ApUserTeamRepository.DeleteElement(userPart);
                /* Уменьшаю количество участников в комнде */
                if (team.MemberQnt > 0)
                {
                    team.MemberQnt = team.MemberQnt - 1;
                }

                _unitOfWork.Save();

                /* Получаю пользователя, который удаляет пользователя из матча */
                ApUser deletingUser = _unitOfWork.ApUserRepository.GetItem(deletingUserId);
                if (deletingUser == null) { return BadRequest(); }

                if (deletingUser.Role == "system")
                    notifiConstant = _unitOfWork.ConstantRepository.GetConstantByName("DeleteTeamUserAdmin");
                else
                    notifiConstant = _unitOfWork.ConstantRepository.GetConstantByName("deleteuserfromteam");

                if(notifiConstant != null)
                {
                    string notiffiMess = notifiConstant.StrValue.Replace("{game}", team.Name);
                    _notifications.Clients.User(Convert.ToString(deleteUserId)).SendAsync("displayNotifiError", notiffiMess);

                    Notification notification = new Notification(deleteUserId, notifiConstant.Type, notiffiMess, team.PkId, deletingUserId);
                    _unitOfWork.NotificationRepository.AddElement(notification);
                }

                _teamHub.Clients.User(Convert.ToString(deleteUserId)).SendAsync("refreshteamcard");

                return Ok(new { message = "Пользователь удален из команды!" });
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // ------------------------------------------------------------------------------------------------------ //

        [HttpDelete]
        [Route("delete-team/{teamId}")]
        public async Task<ActionResult> DeleteTeam(int teamId, int deleteUserId)
        {
            /* Нет проверки, что это организатор удаляет */
            try
            {
                if (HttpContext.User == null) { return BadRequest(); }

                int userId = int.Parse(HttpContext.User.Identity.Name);
                Constant constant1 = null;
                Constant constant2 = null;
                Constant constant3 = null;

                /* Удаляемая команда */
                Team team = _unitOfWork.TeamRepository.GetItem(teamId);
                if (team == null) { return BadRequest(); }

                ApUser deletingUser = _unitOfWork.ApUserRepository.GetItem(userId);
                if (deletingUser == null) { return BadRequest(); }

                /* Список участников команды */
                List<ApUser> teamParticipants = _unitOfWork.ApUserTeamRepository.GetTeamParticipants(team.PkId);

                if (deletingUser.Role == "system")
                {
                    constant1 = _unitOfWork.ConstantRepository.GetConstantByName("DeleteGameAdmin");
                    constant2 = _unitOfWork.ConstantRepository.GetConstantByName("LeavTeamGameAdmin");
                    constant3 = _unitOfWork.ConstantRepository.GetConstantByName("DeleteTeamAdmin");
                }
                else
                {
                    constant1 = _unitOfWork.ConstantRepository.GetConstantByName("deletegame");
                    constant2 = _unitOfWork.ConstantRepository.GetConstantByName("leaveteamgame");
                    constant3 = _unitOfWork.ConstantRepository.GetConstantByName("deleteteam");
                }

                /* Удаляю матчи, в которых команда является организатором и они не сыграны */
                List<TeamGame> creatGame = _unitOfWork.TeamGameRepasitory.GetMatchesByCreatorTeam(team.PkId, (int)TeamGameStatus.WAIT);
                for(int i = 0; i < creatGame.Count; i++)
                {
                    if(constant1 != null)
                    {
                        string notiffiMess1 = constant1.StrValue.Replace("{game}", creatGame[i].Name);
                        /* Уведомление участникам матчей, что матч удален */
                        List<ApUser> gameParticipants = _unitOfWork.ApUserTeamGameRepasitory.GetTeamGameParticipants(creatGame[i].PkId);
                        for (int q = 0; q < gameParticipants.Count; q++)
                        {
                            if (gameParticipants[q].PkId == userId) continue;
                            await _notifications.Clients.User(Convert.ToString(gameParticipants[q].PkId)).SendAsync("displayNotifiError", notiffiMess1);
                            
                            Notification notification1 = new Notification(gameParticipants[q].PkId, constant1.Type, notiffiMess1, creatGame[i].PkId, userId);
                            _unitOfWork.NotificationRepository.AddElement(notification1);
                        }
                    }

                    _teamGameHub.Clients.Group(Convert.ToString(creatGame[i].PkId)).SendAsync("deleteGame");
                    _unitOfWork.TeamGameRepasitory.DeleteElement(creatGame[i].PkId);
                }

                /* Меняю информацию в матчах в которых команда являлась участником и они не сыграны */
                List<TeamGame> partGame = _unitOfWork.TeamGameRepasitory.GetMatchesByParticipantTeam(team.PkId, (int)TeamGameStatus.WAIT);
                for (int i = 0; i < partGame.Count; i++)
                {
                    partGame[i].FkSecondTeamId = 1;
                    partGame[i].Status = (int)TeamGameStatus.SEARCH;

                    for(int j = 0; j < teamParticipants.Count; j++)
                    {
                        ApUserTeamGame part = _unitOfWork.ApUserTeamGameRepasitory.GetTeamGameParticiapnt(partGame[i].PkId, teamParticipants[j].PkId);
                        if(part != null)
                            _unitOfWork.ApUserTeamGameRepasitory.DeleteElement(part);
                    }

                    ApUserTeamGame creator = _unitOfWork.ApUserTeamGameRepasitory.GetTeamGameCreatorRecord(partGame[i].PkId);
                    if(creator != null)
                    {
                        if(constant2 != null)
                        {
                            string notiffiMess2 = constant2.StrValue.Replace("{team}", team.Name)
                                                                    .Replace("{game}", partGame[i].Name);

                            await _notifications.Clients.User(Convert.ToString(creator.PkFkUserId)).SendAsync("displayNotifiError", notiffiMess2);

                            Notification notification2 = new Notification(creator.PkFkUserId, constant2.Type, notiffiMess2, partGame[i].PkId, userId);
                            _unitOfWork.NotificationRepository.AddElement(notification2);
                        }
                    }
                }

                /* Отправляю уведомление участником команды, что команда удалена */
                if (constant3 != null)
                {
                    string notiffiMess3 = constant3.StrValue.Replace("{team}", team.Name);

                    for (int k = 0; k < teamParticipants.Count; k++)
                    {
                        if (teamParticipants[k].PkId == userId) continue;

                        await _notifications.Clients.User(Convert.ToString(teamParticipants[k].PkId)).SendAsync("displayNotifiError", notiffiMess3);

                        Notification notification3 = new Notification(teamParticipants[k].PkId, constant3.Type, notiffiMess3, team.PkId, userId);
                        _unitOfWork.NotificationRepository.AddElement(notification3);
                    }
                }

                _teamHub.Clients.Group(Convert.ToString(team.PkId)).SendAsync("refreshteam");
                team.Status = (int)TeamStatus.DELETE;
                _unitOfWork.Save();

                return Ok(new {message = "Команда успешно удалена!"});
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

    }
}
