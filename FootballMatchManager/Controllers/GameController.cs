using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.IncompleteModels;
using Microsoft.AspNetCore.Mvc;
using FootballMatchManager.Utilts;
using FootballMatchManager.DataBase.Models;
using FootballMatchManager.Enums;
using FootballMatchManager.AppDataBase.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FootballMatchManager.Controllers
{
    [Route("api/profile/")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private UnitOfWork _unitOfWork;
        public GameController(UnitOfWork unitOfWork)
        {
            this._unitOfWork = unitOfWork;
        }

        // --------------------------------------------------------------------------------------------- //

        [Route("get-all-games")]
        [HttpGet]
        public IActionResult Get()
        {
            List<Game> allgames = _unitOfWork.GameRepository.GetAllGamesForUser();

            if (allgames == null)
            {
                return BadRequest(new {message = "Создайте матч!"});
            }
            else
            {
                return Ok(allgames);
            }
        }

        // --------------------------------------------------------------------------------------------- //

        [Route("game/{gameid}/{userid}")]
        [HttpGet]
        public IActionResult MatchProfile(int gameId, int userid)
        {
            bool isParticipant = false;
            bool isCreator = false;

            Game game = _unitOfWork.GameRepository.GetItem(gameId);

            if(game == null)
            {
                return BadRequest();
            }

            /* Проверка на завершенность матча */
            if (game.Status < (int)TeamGameStatus.FINISHED && game.DateTime < DateTime.Now)
            {
                game.Status = (int)TeamGameStatus.FINISHED;
                _unitOfWork.Save();
            }

            ApUserGame apUserGamePt = _unitOfWork.ApUserGameRepository.GetItems()
                                                                      .FirstOrDefault(apug => apug.PkFkGameId == gameId && apug.PkFkUserId == userid && apug.PkUserType == "participant");

            ApUserGame apUserGameCr = _unitOfWork.ApUserGameRepository.GetItems()
                                              .FirstOrDefault(apug => apug.PkFkGameId == gameId && apug.PkFkUserId == userid && apug.PkUserType == "creator");

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

        // --------------------------------------------------------------------------------------------- //

        [HttpGet]
        [Route("game-users/{id}")]
        public ActionResult GetMatchUser(int id)
        {

            List<ApUser> apUsers = _unitOfWork.ApUserGameRepository.GetGameUsers(id);

            if (apUsers != null)
            {
                return Ok(apUsers);
            }
            else
            {
                return BadRequest(new { message = "На данный матч нет пользователей" });
            }

        }

        // --------------------------------------------------------------------------------------------- //

        [Route("add-to-game")]
        [HttpPost]
        public IActionResult AddToMatch()
        {
            int gameId;
            int userId;

            /* Переделать добавление к матчу, на получение пользоватедя через контекст */

            try
            {
                gameId = int.Parse(Request.Form["gameId"]);
                userId = int.Parse(Request.Form["userId"]);

            }catch(Exception ex) 
            {
                return BadRequest("Ошибка преобразования");
            }

            /* Получаем игру к которой хочет присоединиться пользователь */
            Game game = _unitOfWork.GameRepository.GetItem(gameId);

            /* нужно как-то различать сообщения, которые можно пользователю показывать и которые нельзя */ 
            if(game == null)
            {
                return BadRequest(new {message = "Матч не найден!"});
            }

            if(game.CurrPlayers >= game.MaxPlayers)
            {
                return BadRequest(new { message = "Пользователей достаточное количество" });
            }

            /* Получаем участника матча */
            ApUserGame apUserGameEx = _unitOfWork.ApUserGameRepository.GetUserFromGame(gameId, userId);

            if (apUserGameEx != null)
            {
                return BadRequest(new { message = "Пользователь уже присоединился к матчу" });
            }

            /* Учеличиваем количество пользователей на матче */
            game.CurrPlayers += 1;

            ApUserGame apUserGame = new ApUserGame()
            {
                PkFkGameId = gameId,
                PkFkUserId = userId,
                PkUserType = "participant"
            };

            _unitOfWork.ApUserGameRepository.AddElement(apUserGame);
            _unitOfWork.Save();

            List<ApUser> apUsers = _unitOfWork.ApUserGameRepository.GetGameUsers(gameId);

            /* Зачем нужно вот это условие */
            if (apUsers == null)
            {
                return Ok(new { message = "Вы присоеденились к матчу", currgame = game});
            }
            else
            {
                return Ok(new { message = "Вы присоеденились к матчу", users = apUsers, currgame = game });
            }

        }

        // ----------------------------------------------------------------------------------------------------------------------------------------- //

        [Route("create-game")]
        [HttpPost]
        public IActionResult Post([FromBody] ShortGame shortGame)
        {
            try
            {
            if (HttpContext.User == null) { return BadRequest(); }

            int userId = int.Parse(HttpContext.User.Identity.Name);

            int gameMaxPlayers;
            int gameType;

            //Хорошо бы это на клиенте сделать, а сюда передавать числовое значение
            //Не очень хорошо скорее всего присваить нулевое значение
            switch (shortGame.GameFormat)
            {
                case "5x5": gameMaxPlayers = 10; break;
                case "9x9": gameMaxPlayers = 18; break;
                case "11x11": gameMaxPlayers = 22; break;
                default: gameMaxPlayers = 0; break;
            }

            switch(shortGame.GameType)
            {
                case "Публичный": gameType = (int)GameEnum.PUBLIC; break;
                case "Закрытый": gameType = (int)GameEnum.CLOSED; break;
                default: gameType = (int)GameEnum.PUBLIC; break;
            }


            Game game = new Game(shortGame.GameName, shortGame.GameAdress, shortGame.GameDate, gameMaxPlayers, shortGame.GameFormat, gameType);


            _unitOfWork.GameRepository.AddElement(game);
            _unitOfWork.Save();

            ApUserGame apUserGameCr = new ApUserGame()
            {
                PkFkGameId = game.PkId,
                PkFkUserId = userId,
                PkUserType = "creator",
            };

            ApUserGame apUserGamePt = new ApUserGame()
            {
                PkFkGameId = game.PkId,
                PkFkUserId = userId,
                PkUserType = "participant",
            };


            _unitOfWork.ApUserGameRepository.AddElement(apUserGameCr);
            _unitOfWork.ApUserGameRepository.AddElement(apUserGamePt);
            _unitOfWork.Save();

            List<Game> allgames = _unitOfWork.GameRepository.GetAllGamesForUser();

            return Ok(new { reqmess = "Матч успешно создан!", allgames = allgames });
            }
            catch(Exception ex)
            {
                return BadRequest();
            }
        }

        // ----------------------------------------------------------------------------------------------------------------------------------------- //

        [Route("user-creat-game")]
        [HttpPost]
        public IActionResult PostUserCreatMatch()
        {
            try
            {
                var userID = int.Parse(Request.Form["userId"]);

                List<Game> games = _unitOfWork.ApUserGameRepository.GetItems()
                                                                   .Where(ap => ap.PkFkUserId == userID && ap.PkUserType == "creator")
                                                                   .Select(ap => ap.Game)
                                                                   .ToList();

                if (games == null)
                {
                    return BadRequest(new { message = "Пользователь не учавствует в матчах" });
                }

                return Ok(games);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // ----------------------------------------------------------------------------------------------------------------------------------------- //

        [Route("user-part-game")]
        [HttpPost]
        public IActionResult PostUserPartMatch()
        {
            try
            {
                var userID = int.Parse(Request.Form["userId"]);

                List<Game> games = _unitOfWork.ApUserGameRepository.GetItems().Where(ap => ap.PkFkUserId == userID && ap.PkUserType == "participant").Select(ap => ap.Game).ToList();

                if (games == null)
                {
                    return BadRequest(new { message = "Пользователь не создавал матчей" });
                }

                return Ok(games);

            }
            catch (Exception ex)
            {
                return BadRequest();
            } 
        }

        // ------------------------------------------------------------------------------- //

        [HttpPost]
        [Route("edit-game")]
        public ActionResult PostEditGame([FromBody] ShortGame shortGame)
        {
            Game game = _unitOfWork.GameRepository.GetItem(shortGame.GameId);

            if (game == null)
            {
                return BadRequest(new { message = "Данной игры не существует" });
            }

            game.Name = shortGame.GameName;
            game.DateTime = shortGame.GameDate;
            game.Format = shortGame.GameFormat;
            game.Adress = shortGame.GameAdress;

            _unitOfWork.Save();

            return Ok(new { message = "Данные успешно сохранены", askdata = game });
        }

        // ------------------------------------------------------------------------------- //

        [HttpPost]
        [Route("addmessage")]
        public ActionResult PostAddMessage()
        {
            /*
            Message message = new Message()
            {
                Text = Request.Form["MessageText"],
                DateTime = DateTime.Now,
                FkGameId = int.Parse(Request.Form["GameRecipient"]),
                FkSenderId = int.Parse(Request.Form["MessageSender"])
            };

            _unitOfWork.MessageRepository.AddElement(message);

            _unitOfWork.Save();

            */
            //return Ok(message)
            return Ok();
        }

        // ------------------------------------------------------------------------------- //

        [HttpDelete]
        [Route("leave-from-game/{gameId}/{userId}")]
        public ActionResult DeleteLeaveFromGame(int gameId, int userId)
        {


            Game game = _unitOfWork.GameRepository.GetItem(gameId);

            if(game == null)
            {
                return BadRequest(new { message = "Матч не найден!" });
            }

            if(game.CurrPlayers <= 0)
            {
                return BadRequest(new {message = "Ошибка количества пользователей не матче"});
            }

            ApUserGame apUserGame = _unitOfWork.ApUserGameRepository.GetUserFromGame(gameId, userId);

            if (apUserGame == null)
            {
                return BadRequest(new { message = "Вы не зарегистрированы на матч" });
            }

            _unitOfWork.ApUserGameRepository.DeleteElement(apUserGame);
            game.CurrPlayers -= 1;
            _unitOfWork.Save();

            List<ApUser> apUsers = _unitOfWork.ApUserGameRepository.GetGameUsers(gameId);

            if (apUsers == null)
            {
                return Ok(new { message = "Вы покинули матч", currgame = game });
            }
            else
            {
                return Ok(new { message = "Вы покинули матч", users = apUsers, currgame = game });
            }
        }

        // ------------------------------------------------------------------------------- //

        [HttpDelete]
        [Route("delete-game/{id}")]
        public ActionResult DeleteGame(int id)
        {
            Game game = _unitOfWork.GameRepository.GetItem(id);

            if (game == null)
            {
                return BadRequest(new { message = "Данного матча не существует" });
            }

            _unitOfWork.GameRepository.DeleteElement(id);
            _unitOfWork.Save();

            List<Game> games = _unitOfWork.GameRepository.GetItems().ToList();

            if (games == null)
            {
                return BadRequest(new { message = "Нет созданных матчей" });
            }
            else
            {
                return Ok(new { message = "Матч удален", rgames = games });
            }
        }

        // ------------------------------------------------------------------------------- //
    }
}
