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
    public class TournamentController : ControllerBase
    {
        /*
        private UnitOfWork _unitOfWork;
        private JwtService _jwtService;
        public TournamentController(UnitOfWork unitOfWork, JwtService jwtService)
        {
            this._unitOfWork = unitOfWork;
            this._jwtService = jwtService;
        }

        [Route("alltour")]
        [HttpGet]
        public IActionResult Get()
        {

            IEnumerable<Tournament> tours = _unitOfWork.TournamentRepository.GetItems().Where(t => t.TournamentStatus != "block" && t.TournamentId != 1).OrderByDescending(t => t.TournamentStartDate);
      
            if (tours == null)
            {
                return BadRequest(new { message = "Создайте турнир!" });
            }
            else
            {
                return Ok(tours);
            }
        }
        [Route("tour/{tourid}/{userid}")]
        [HttpGet]
        public IActionResult TourProfile(int tourId, int userId)
        {
            bool isParticipant = false;
            bool isCreator = false;

            Tournament tour = _unitOfWork.TournamentRepository.GetItem(tourId);

            if (tour == null)
            {
                return BadRequest(new { message = "Турнир не найден" });
            }

            ApUserTeam apUserTeam = _unitOfWork.ApUserTeamRepository.GetItems().FirstOrDefault(aput => aput.UserId == userId && aput.UserType == "creator");

            if(apUserTeam == null)
            {
                return Ok(new { currtour = tour, isPart = isParticipant, isCreat = isCreator, message = "Для участия в турнире создайте команду" });
            }


            TournamentTable tt = _unitOfWork.TournamentTableRepository.GetItems()
                                                                      .FirstOrDefault(tt => tt.TeamId == apUserTeam.TeamId);


            if (tt != null)
            {
                isParticipant = true;
            }

            if (tour.UserCreator == userId)
            {
                isCreator = true;
            }


            return Ok(new { currtour = tour, isPart = isParticipant, isCreat = isCreator });
        }

        [HttpGet]
        [Route("tourteams/{tourId}")]
        public ActionResult GetMatchUser(int tourId)
        {
            List<Team> teams = _unitOfWork.TournamentTableRepository.GetItems().Where(tt => tt.TournamentId == tourId).Select(tt => tt.TournamentTeam).ToList();


            if (teams != null)
            {
                return Ok(teams);
            }
            else
            {
                return BadRequest(new { message = "На данный матч нет пользователей" });
            }

        }

        [Route("addtotour")]
        [HttpPost]
        public IActionResult AddToTour()
        {

            int tourId = int.Parse(Request.Form["tourId"]);
            int userId = int.Parse(Request.Form["userId"]);

            Tournament tour = _unitOfWork.TournamentRepository.GetItems().FirstOrDefault(t => t.TournamentId == tourId);

            ApUserTeam apUserTeam = _unitOfWork.ApUserTeamRepository.GetItems().FirstOrDefault(aput => aput.UserId == userId && aput.UserType == "creator");

            if (apUserTeam == null)
            {
                return BadRequest(new { message = "Пользователь не иммеет команды" });
            }

            TournamentTable tt = _unitOfWork.TournamentTableRepository.GetItems()
                                                                      .FirstOrDefault(tt => tt.TournamentId == tourId && tt.TeamId == apUserTeam.TeamId);

            if (tt != null)
            {
                return BadRequest(new { message = "Пользователь уже зарегистрировал команду на матч" });
            }

            TournamentTable newTT = new TournamentTable()
            {
                TournamentId = tour.TournamentId,
                TeamId = apUserTeam.TeamId,
            };

            _unitOfWork.TournamentTableRepository.AddElement(newTT);
            _unitOfWork.Save();

            List<Team> teams = _unitOfWork.TournamentTableRepository.GetItems()
                                                                   .Where(tt => tt.TournamentId == tourId)
                                                                   .Select(tt => tt.TournamentTeam).ToList();


            if (teams == null)
            {
                return Ok(new { message = "Вы присоеденились к матчу", currtour = tour});
            }
            else
            {
                return Ok(new { message = "Вы присоеденились к матчу", tteams = teams, currtour = tour});
            }

        }

        [HttpPost]
        [Route("createtour")]
        public IActionResult PostCreateTour([FromBody] ShortTournament shortTournament)
        {
            int userId = shortTournament.UserCreator;

            ApUserTeam apUserTeam = _unitOfWork.ApUserTeamRepository.GetItems().FirstOrDefault(aput => aput.UserId == userId && aput.UserType == "creator");

            if (apUserTeam == null)
            {
                return BadRequest(new {message = "Сначала создайте команду"});
            }

            Tournament tour = new Tournament()
            {
                TournamentName = shortTournament.TourName,
                TournamentStartDate = shortTournament.TourStartDate,
                TournamentEndDate = shortTournament.TourEndDate,
                TeamsNumber = shortTournament.TeamNumbers,
                TournamentPrizeFund = shortTournament.TourPrizeFound,
                UserCreator = userId
            };


            _unitOfWork.TournamentRepository.AddElement(tour);
            _unitOfWork.Save();

            TournamentTable tt = new TournamentTable()
            {
                TournamentId = tour.TournamentId,
                TeamId = apUserTeam.TeamId
            };

            _unitOfWork.TournamentTableRepository.AddElement(tt);
            _unitOfWork.Save();

            return Ok("Турнир успешно создан");
        }

        [HttpDelete]
        [Route("leavefromtour/{tourId}/{userId}")]
        public ActionResult DeleteLeaveFromGame(int tourId, int userId)
        {

            Tournament tour = _unitOfWork.TournamentRepository.GetItem(tourId);

            if(tour == null)
            {
                return BadRequest(new {message = "Турнирна не существует"});
            }

            ApUserTeam apUserTeam = _unitOfWork.ApUserTeamRepository.GetItems().FirstOrDefault(aput => aput.UserId == userId);

            if(apUserTeam == null)
            {
                return BadRequest(new {message = "У пользователя нет комманды"});
            }

            TournamentTable tt = _unitOfWork.TournamentTableRepository.GetItems()
                                                                    .FirstOrDefault(tt => tt.TournamentId == tourId && tt.TeamId == apUserTeam.TeamId);

            if (tt == null)
            {
                return BadRequest(new { message = "Вы не зарегистрированы на турнир" });
            }

            _unitOfWork.TournamentTableRepository.DeleteElement(tt);

            _unitOfWork.Save();

            List<Team> teams = _unitOfWork.TournamentTableRepository.GetItems().Where(tt => tt.TournamentId == tourId)
                                                                                   .Select(tt => tt.TournamentTeam)
                                                                                   .ToList();

            if (teams == null)
            {
                return Ok(new { message = "Вы покинули турнир", currtour = tour });
            }
            else
            {
                return Ok(new { message = "Вы покинули матч", tteams = teams, currtour = tour});
            }
        }
        */
    }
}
