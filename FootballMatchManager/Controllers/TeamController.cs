using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.DataBase.Models;
using FootballMatchManager.IncompleteModels;
using FootballMatchManager.Utilts;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FootballMatchManager.Controllers
{
    [Route("api/profile/")]
    [ApiController]
    public class TeamController : ControllerBase
    {
        private UnitOfWork _unitOfWork;
        private JwtService _jwtService;
        public TeamController(UnitOfWork unitOfWork, JwtService jwtService)
        {
            this._unitOfWork = unitOfWork;
            this._jwtService = jwtService;
        }

        [Route("allteams")]
        [HttpGet]
        public IActionResult Get()
        {
            IEnumerable<Team> teams = _unitOfWork.TeamRepository.GetItems().OrderByDescending(t => t.CreateDate);

            if (teams == null)
            {
                return BadRequest(new { message = "Создайте команду!" });
            }
            else
            {
                return Ok(teams);
            }
        }
        [Route("team/{teamid}/{userid}")]
        [HttpGet]
        public IActionResult TeamProfile(int teamId, int userid)
        {
            bool isParticipant = false;

            Team team = _unitOfWork.TeamRepository.GetItem(teamId);

            if (team == null)
            {
                return BadRequest(new { message = "Матч не найден" });
            }

            ApUserTeam apUserTeamPt = _unitOfWork.ApUserTeamRepository.GetItems()
                                                          .FirstOrDefault(aput => aput.TeamId == teamId && aput.UserId == userid && aput.UserType == "participant");

            if (apUserTeamPt != null)
            {
                isParticipant = true;
            }

            return Ok(new { currteam = team, isPart = isParticipant});
        }

        [HttpGet]
        [Route("teamusers/{teamId}")]
        public ActionResult GetTeamUser(int teamId)
        {

            List<ApUser> apUsers = _unitOfWork.ApUserTeamRepository.GetItems()
                                                           .Where(aput => aput.TeamId == teamId && aput.UserType == "participant")
                                                           .Select(aput => aput.ApUser).ToList();

            if (apUsers.Count == 0)
            {
                return BadRequest(new { message = "На данный матч нет пользователей" });
            }
            else
            {
                return Ok(apUsers);
            }
        }

        [Route("addtoteam")]
        [HttpPost]
        public IActionResult AddToTeam()
        {

            int teamId = int.Parse(Request.Form["teamId"]);
            int userId = int.Parse(Request.Form["userId"]);

            /*Можно было бы добавить количество участников*/
            Team team = _unitOfWork.TeamRepository.GetItem(teamId);


            ApUserTeam apUserTeamEx = _unitOfWork.ApUserTeamRepository.GetItems()
                                                                    .FirstOrDefault(aput => aput.TeamId == teamId && aput.UserId == userId && aput.UserType == "participant");

            if (apUserTeamEx != null)
            {
                return BadRequest(new { message = "Пользователь уже является участником команды" });
            }

            ApUserTeam apUserTeam = new ApUserTeam()
            {
                TeamId = teamId,
                UserId = userId,
                UserType = "participant"
            };

            _unitOfWork.ApUserTeamRepository.AddElement(apUserTeam);
            _unitOfWork.Save();

            List<ApUser> apUsers = _unitOfWork.ApUserTeamRepository.GetItems()
                                                                   .Where(aput => aput.TeamId == teamId && aput.UserType == "participant")
                                                                   .Select(aput => aput.ApUser).ToList();


            if (apUsers.Count == 0)
            {
                return Ok(new { message = "Вы присоеденились к команде", currteam = team});
            }
            else
            {
                return Ok(new { message = "Вы присоеденились к команде", users = apUsers, currteam = team });
            }

        }
        [Route("createteam")]
        [HttpPost]
        public IActionResult Post()
        {

            int userId = int.Parse(Request.Form["userId"]);

            Team team = new Team()
            {
                TeamName = Request.Form["teamName"],
                CreateDate = DateTime.Now
            };

            _unitOfWork.TeamRepository.AddElement(team);
            _unitOfWork.Save();

            ApUserTeam apUserTeamCr = new ApUserTeam()
            {
                TeamId = team.TeamId,
                UserId = userId,
                UserType = "creator",
            };

            ApUserTeam apUserTeamPt = new ApUserTeam()
            {
                TeamId = team.TeamId,
                UserId = userId,
                UserType = "participant",
            };


            _unitOfWork.ApUserTeamRepository.AddElement(apUserTeamCr);
            _unitOfWork.ApUserTeamRepository.AddElement(apUserTeamPt);
            _unitOfWork.Save();

            return Ok("Матч успешно создан");
        }


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
    }
}
