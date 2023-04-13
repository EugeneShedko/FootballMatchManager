using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.DataBase.Models;
using FootballMatchManager.Enums;
using FootballMatchManager.IncompleteModels;
using FootballMatchManager.Utilts;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FootballMatchManager.Controllers
{
    [Route("api/team/")]
    [ApiController]
    public class TeamController : ControllerBase
    {
        private UnitOfWork _unitOfWork;
        public TeamController(UnitOfWork unitOfWork)
        {
            this._unitOfWork = unitOfWork;
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

                if (_unitOfWork.ApUserTeamRepository.GetTeamCreatorByUserId(userCreatorId) != null)
                {
                    return BadRequest("Невозможно создать команду, так как вы уже являетесь организатором команды.");
                }

                if (_unitOfWork.TeamRepository.GetTeamByName(teamName) != null) 
                {
                    return BadRequest("Команда с таким наименованием уже существует"); 
                }

                var imageFile = Request.Form.Files["teamImage"];

                /* Создаем команду */
                Team team = new Team(teamName, Request.Form["teamDesk"]);

                /* Создаем папку для команды на сервере */
                MD5 md5 = MD5.Create();
                Directory.CreateDirectory("wwwroot/teams/" + Convert.ToBase64String(
                                                       md5.ComputeHash(
                                                       Encoding.UTF8.GetBytes(team.Name))));

                /* Устанавливаем картинку команде */
                if (imageFile != null)
                {
                    team.Image = FileManager.LoadTeamImage(imageFile, team.Name);
                }

                _unitOfWork.TeamRepository.AddElement(team);
                _unitOfWork.Save();

                ApUserTeam apUserTeamCr = new ApUserTeam(team.PkId, userCreatorId, (int)ApUserTeamEnum.CREATOR);
                ApUserTeam apUserTeamPt = new ApUserTeam(team.PkId, userCreatorId, (int)ApUserTeamEnum.PARTICIPANT);

                _unitOfWork.ApUserTeamRepository.AddElement(apUserTeamCr);
                _unitOfWork.ApUserTeamRepository.AddElement(apUserTeamPt);
                _unitOfWork.Save();

                List<Team> allTeams = _unitOfWork.TeamRepository.GetAllTeams();

                /* Изменить на стороне клиента еще отображение */
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

                bool isParticipant = false;

                Team team = _unitOfWork.TeamRepository.GetItem(teamId);

                if (team == null)
                {
                    return BadRequest();
                }

                ApUserTeam apUserTeamPt = _unitOfWork.ApUserTeamRepository.GetTeamParticipant(team.PkId, userId);

                if (apUserTeamPt != null)
                {
                    isParticipant = true;
                }

                return Ok(new { currteam = team, isPart = isParticipant });
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // ------------------------------------------------------------------------------------------------------ //

        /* Пока что с одной командой, там дальше будем расширяться */
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
                return Ok();
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

                //Можно было бы добавить количество участников
                Team team = _unitOfWork.TeamRepository.GetItem(teamId);

                if(team == null) { return BadRequest(); }

                ApUserTeam apUserTeamEx = _unitOfWork.ApUserTeamRepository.GetTeamParticipant(teamId, userId);

                if (apUserTeamEx != null)
                {
                    return BadRequest();
                }

                ApUserTeam apUserTeam = new ApUserTeam(teamId, userId, (int)ApUserTeamEnum.PARTICIPANT);

                _unitOfWork.ApUserTeamRepository.AddElement(apUserTeam);
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

/*
[HttpPut("{id}")]
public void Put(int id, [FromBody] string value)
{
}

[HttpDelete]
[Route("leavefromteam/{teamId}/{userId}")]
public ActionResult DeleteLeaveFromGame(int teamId, int userId)
{

ApUserTeam apUserTeam = _unitOfWork.ApUserTeamRepository.GetItems()
                                                    .FirstOrDefault(aput => aput.TeamId == teamId && aput.UserId == userId && aput.UserType == "participant");

if (apUserTeam == null)
{
return BadRequest(new { message = "Вы являетесь участником команды" });
}

_unitOfWork.ApUserTeamRepository.DeleteElement(apUserTeam);

_unitOfWork.Save();

Team team = _unitOfWork.TeamRepository.GetItem(teamId);

List<ApUser> apUsers = _unitOfWork.ApUserTeamRepository.GetItems().Where(aput => aput.TeamId == teamId && aput.UserType == "participant")
                                                                   .Select(aput => aput.ApUser)
                                                                   .ToList();

if (apUsers == null)
{
return Ok(new { message = "Вы покинули команду", currteam = team });
}
else
{
return Ok(new { message = "Вы покинули команду", users = apUsers, currteam = team });
}
}
*/
    }
}
