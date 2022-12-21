using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.IncompleteModels;
using Microsoft.AspNetCore.Mvc;
using FootballMatchManager.Utilts;
using FootballMatchManager.DataBase.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FootballMatchManager.Controllers
{
    [Route("api/profile/")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private UnitOfWork _unitOfWork;
        private JwtService _jwtService;
        public GameController(UnitOfWork unitOfWork, JwtService jwtService)
        {
            this._unitOfWork = unitOfWork;
            this._jwtService = jwtService;
        }

        [Route("allmatches")]
        [HttpGet]
        public IActionResult Get()
        {
            IEnumerable<Game> games = _unitOfWork.GameRepository.GetItems().Where(g => g.GameStatus != "block").OrderByDescending(g => g.GameDateTime);

            if(games == null)
            {
                return BadRequest(new {message = "Создайте матч!"});
            }
            else
            {
                return Ok(games);
            }
        }

        [Route("game/{gameid}/{userid}")]
        [HttpGet]
        public IActionResult MatchProfile(int gameId, int userid)
        {
            bool isParticipant = false;
            bool isCreator = false;

            Game game = _unitOfWork.GameRepository.GetItem(gameId);

            if(game == null)
            {
                return BadRequest(new { message = "Матч не найден" });
            }

            ApUserGame apUserGamePt = _unitOfWork.ApUserGameRepository.GetItems()
                                                                      .FirstOrDefault(apug => apug.GameId == gameId && apug.UserId == userid && apug.UserType == "participant");

            ApUserGame apUserGameCr = _unitOfWork.ApUserGameRepository.GetItems()
                                              .FirstOrDefault(apug => apug.GameId == gameId && apug.UserId == userid && apug.UserType == "creator");

            if (apUserGamePt != null) 
            {
                isParticipant = true;
            }

            if (apUserGameCr != null)
            {
                isCreator = true;
            }


            return Ok(new { currgame = game, isPart = isParticipant, isCreat = isCreator } );
        }

        [HttpGet]
        [Route("matchUsers/{id}")]
        public ActionResult GetMatchUser(int id)
        {

            List<ApUser> apUsers = _unitOfWork.ApUserGameRepository.GetItems()
                                                                       .Where(apug => apug.GameId == id && apug.UserType == "participant")
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

        [HttpGet]
        [Route("allmessages/{gameId}")]
        public ActionResult GetAllComments(int gameId)
        {

            List<Message> messages = _unitOfWork.MessageRepository.GetItems().Where(m => m.GameId == gameId).ToList();

            if (messages == null)
            {
                return Ok();
            }
            else
            {
                return Ok(JsonConverter.ConvertMessage(messages));
            }
        }


        [Route("addtomatch")]
        [HttpPost]
        public IActionResult AddToMatch()
        {

            int gameId = int.Parse(Request.Form["gameId"]);
            int userId = int.Parse(Request.Form["userId"]);

            Game game = _unitOfWork.GameRepository.GetItem(gameId);

            if(game.CurrentPlayers < game.GameMaxPlayers)
            {
                game.CurrentPlayers += 1;
                _unitOfWork.Save();
            }
            else
            {
                return BadRequest(new {message = "Пользователей достаточное количество"});
            }

            ApUserGame apUserGameEx = _unitOfWork.ApUserGameRepository.GetItems()
                                                                    .FirstOrDefault(apug => apug.GameId == gameId && apug.UserId == userId && apug.UserType == "participant");

            if(apUserGameEx != null)
            {
                return BadRequest(new {message = "Пользователь уже зарегистрирован на матч"});
            }

            ApUserGame apUserGame = new ApUserGame()
            {
                GameId = gameId,
                UserId = userId,
                UserType = "participant"
            };

            _unitOfWork.ApUserGameRepository.AddElement(apUserGame);
            _unitOfWork.Save();

            List<ApUser> apUsers = _unitOfWork.ApUserGameRepository.GetItems()
                                                                   .Where(apug => apug.GameId == gameId && apug.UserType == "participant")
                                                                   .Select(apug => apug.ApUser).ToList();


            if (apUsers == null)
            {
                return Ok(new { message = "Вы присоеденились к матчу", currgame = game});
            }
            else
            {
                return Ok(new { message = "Вы присоеденились к матчу", users = apUsers, currgame = game });
            }

        }


        [Route("creatematch")]
        [HttpPost]
        public IActionResult Post([FromBody] ShortGame shortGame)
        {
            int gameMaxPlayers;

            //Хорошо бы это на клиенте сделать, а сюда передавать числовое значение
            //Не очень хорошо скорее всего присваить нулевое значение
            switch (shortGame.GameFormat)
            {
                case "5x5": gameMaxPlayers = 10; break;
                case "9x9": gameMaxPlayers = 18; break;
                case "11x11": gameMaxPlayers = 22; break;
                default: gameMaxPlayers = 0; break;
            }

            Game game = new Game()
            {
                GameName = shortGame.GameName,
                GameAdress = shortGame.GameAdress,
                GameDateTime = shortGame.GameDate,
                GameMaxPlayers = gameMaxPlayers,
                GameFormat = shortGame.GameFormat,
                CurrentPlayers = 1,
                GameType = "match"
            };

            _unitOfWork.GameRepository.AddElement(game);
            _unitOfWork.Save();

            ApUserGame apUserGameCr = new ApUserGame()
            {
                GameId = game.GameId,
                UserId = shortGame.UserId,
                UserType = "creator",
            };

            ApUserGame apUserGamePt = new ApUserGame()
            {
                GameId = game.GameId,
                UserId = shortGame.UserId,
                UserType = "participant",
            };


            _unitOfWork.ApUserGameRepository.AddElement(apUserGameCr);
            _unitOfWork.ApUserGameRepository.AddElement(apUserGamePt);
            _unitOfWork.Save();

            return Ok("Матч успешно создан");
        }


        [Route("userCreatMatch")]
        [HttpPost]
        public IActionResult PostUserCreatMatch()
        {
            var userID = int.Parse(Request.Form["userId"]);

            List<Game> games = _unitOfWork.ApUserGameRepository.GetItems().Where(ap => ap.UserId == userID && ap.UserType == "creator").Select(ap => ap.Game).ToList();

            if(games == null)
            {
                return BadRequest(new { message = "Пользователь не учавствует в матчах" });
            }

            return Ok(games);
        }

        [Route("userpartmatch")]
        [HttpPost]
        public IActionResult PostUserPartMatch()
        {
            var userID = int.Parse(Request.Form["userId"]);

            List<Game> games = _unitOfWork.ApUserGameRepository.GetItems().Where(ap => ap.UserId == userID && ap.UserType == "participant").Select(ap => ap.Game).ToList();

            if (games == null)
            {
                return BadRequest(new { message = "Пользователь не создавал матчей" });
            }

            return Ok(games);
        }

        [HttpPost]
        [Route("editgame")]
        public ActionResult PostEditGame([FromBody] ShortGame shortGame)
        {
            Game game = _unitOfWork.GameRepository.GetItem(shortGame.GameId);

            if (game == null)
            {
                return BadRequest(new { message = "Данной игры не существует" });
            }

            game.GameName = shortGame.GameName;
            game.GameDateTime = shortGame.GameDate;
            game.GameFormat = shortGame.GameFormat;
            game.GameAdress = shortGame.GameAdress;

            _unitOfWork.Save();

            return Ok(new { message = "Данные успешно сохранены", askdata = game });
        }

        [HttpPost]
        [Route("addmessage")]
        public ActionResult PostAddMessage()
        {
            Message message = new Message()
            {
                MessageText = Request.Form["MessageText"],
                MessageDateTime = DateTime.Now,
                GameId = int.Parse(Request.Form["GameRecipient"]),
                MessageSender = int.Parse(Request.Form["MessageSender"])
            };

            _unitOfWork.MessageRepository.AddElement(message);

            _unitOfWork.Save();

            return Ok(message);
        }


        [HttpDelete]
        [Route("leavefromgame/{gameId}/{userId}")]
        public ActionResult DeleteLeaveFromGame(int gameId, int userId)
        {

            ApUserGame apUserGame = _unitOfWork.ApUserGameRepository.GetItems()
                                                                    .FirstOrDefault(apug => apug.GameId == gameId && apug.UserId == userId && apug.UserType == "participant");

            if (apUserGame == null)
            {
                return BadRequest(new { message = "Вы не зарегистрированы на матч" });
            }

            _unitOfWork.ApUserGameRepository.DeleteElement(apUserGame);

            _unitOfWork.Save();

            Game game = _unitOfWork.GameRepository.GetItem(gameId);

            if (game.CurrentPlayers > 0)
            {
                game.CurrentPlayers -= 1;
                _unitOfWork.Save();
            }
            else
            {
                return BadRequest();
            }

            List<ApUser> apUsers = _unitOfWork.ApUserGameRepository.GetItems().Where(apug => apug.GameId == gameId && apug.UserType == "participant")
                                                                                   .Select(apug => apug.ApUser)
                                                                                   .ToList();

            if (apUsers == null)
            {
                return Ok(new { message = "Вы покинули матч", currgame = game });
            }
            else
            {
                return Ok(new { message = "Вы покинули матч", users = apUsers, currgame = game });
            }
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
                return Ok(new { message = "Матч удален", rgames = games });
            }
        }
    }
}
