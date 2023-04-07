using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.DataBase.Models;
using FootballMatchManager.Utilts;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FootballMatchManager.Controllers.Admin
{
    [Route("api/admin/profile/")]
    [ApiController]
    public class AdminGameController : ControllerBase
    {

        UnitOfWork _unitOfWork;
        JwtService _jwtService;

        public AdminGameController(UnitOfWork unitOfWork, JwtService jwtService)
        {
            this._unitOfWork = unitOfWork;
            this._jwtService = jwtService;
        }


        [HttpGet]
        [Route("allmatches")]
        public ActionResult GetAllMatches()
        {
            IEnumerable <Game> games = _unitOfWork.GameRepository.GetItems();

            if(games != null)
            {
                return Ok(games);
            }
            else
            {
                return BadRequest(new { message = "Пользователи не создали ни одного матча" });
            }
        }

        [HttpGet]
        [Route("match/{id}")]
        public ActionResult GetMatch(int id)
        {
            Game game = _unitOfWork.GameRepository.GetItem(id);

            if(game != null)
            {
                return Ok(game);
            }
            else
            {
                return BadRequest(new { message = "Матч не найден" });
            }
        }

        [HttpGet]
        [Route("matchUsers/{id}")]
        public ActionResult GetMatchUser(int id)
        {

            List<ApUser> apUsers = _unitOfWork.ApUserGameRepository.GetItems().Where(apug => apug.PkFkGameId == id)
                                                                       .Where(apug => apug.PkFkGameId == id && apug.PkUserType == "participant")
                                                                       .Select(apug => apug.ApUser).ToList();


            if (apUsers != null)
            {
                return Ok(apUsers);
            }
            else
            {
                return BadRequest(new { message = "На данный матч нет пользователей" });
            }

        }

        [HttpPost]
        [Route("blockgame")]
        public ActionResult PostBlockGame()
        {
            var gameId = int.Parse(Request.Form["gameId"]);

            Game game = _unitOfWork.GameRepository.GetItem(gameId);

            if(game == null) 
            {
                return BadRequest(new { message = "Игры не существует" });
            }

            game.Status = "block";

            _unitOfWork.Save();

            return Ok(new {message = "Игра заблокирована", currgame = game});
        }

        [HttpPost]
        [Route("unblockgame")]
        public ActionResult PostUnBlockGame()
        {
            var gameId = int.Parse(Request.Form["gameId"]);

            Game game = _unitOfWork.GameRepository.GetItem(gameId);

            if (game == null)
            {
                return BadRequest(new { message = "Игры не существует" });
            }

            game.Status = "active";

            _unitOfWork.Save();

            return Ok(new { message = "Игра разблокирована", currgame = game });
        }

        [HttpDelete]
        [Route("deletegame/{id}")]
        public ActionResult DeleteGame(int id)
        {
            Game game = _unitOfWork.GameRepository.GetItem(id);

            if (game == null)
            {
                return BadRequest(new { message = "Данного матча не существует" });
            }

            _unitOfWork.GameRepository.DeleteElement(id);

            _unitOfWork.Save();

            IEnumerable<Game> games = _unitOfWork.GameRepository.GetItems();

            if (games == null)
            {
                return BadRequest(new { message = "Нет созданных матчей" });
            }
            else
            {
                return Ok(new { message = "Матч удален", rgames = games});
            }
        }

        [HttpDelete]
        [Route("rmusfromgame/{gameId}/{userId}")]
        public ActionResult DeleteUserFromGame(int gameId, int userId)
        {

            ApUserGame apUserGame = _unitOfWork.ApUserGameRepository.GetItems()
                                                                    .FirstOrDefault(apug => apug.PkFkGameId == gameId && apug.PkFkUserId == userId && apug.PkUserType == "participant");
            /*
            if(apUserGame.Game.CurrentPlayers > 0 )
            {
                apUserGame.Game.CurrentPlayers -= 1;
            }
            else
            {
                return BadRequest();
            }
            */

            if (apUserGame == null)
            {
                return BadRequest(new { message = "Пользователь не зарегистрирован на матч" });
            }

            _unitOfWork.ApUserGameRepository.DeleteElement(apUserGame);

            _unitOfWork.Save();

            Game game = _unitOfWork.GameRepository.GetItem(gameId);

            if (game.CurrPlayers > 0)
            {
                game.CurrPlayers -= 1;
                _unitOfWork.Save();
            }
            else
            {
                return BadRequest();
            }

            List<ApUser> apUsers = _unitOfWork.ApUserGameRepository.GetItems().Where(apug => apug.PkFkGameId == gameId && apug.PkUserType == "participant")
                                                                                   .Select(apug => apug.ApUser)
                                                                                   .ToList();

            if (apUsers == null)
            {
                return Ok(new { message = "Пользователь удален из матча" , currgame = game});
            }
            else
            {
                return Ok(new { message = "Пользователь удален из матча", users = apUsers, currgame = game});
            }
        }



    }
}
