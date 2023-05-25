using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.IncompleteModels;
using Microsoft.AspNetCore.Mvc;
using FootballMatchManager.Utilts;
using FootballMatchManager.DataBase.Models;
using FootballMatchManager.Enums;
using FootballMatchManager.AppDataBase.Models;
using Microsoft.AspNetCore.SignalR;
using FootballMatchManager.Hubs;
using System.Reflection.Metadata;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FootballMatchManager.Controllers
{
    [Route("api/profile/")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private UnitOfWork _unitOfWork;
        private IHubContext<NotificationHub> _notifications;
        private IHubContext<GameHub> _gameHub;

        public GameController(UnitOfWork unitOfWork, 
                              IHubContext<NotificationHub> notofocation,
                              IHubContext<GameHub> gameHub)
        {
            this._unitOfWork    = unitOfWork;
            this._notifications = notofocation;
            this._gameHub       = gameHub;
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
            /* Пока что нужен только идентификатор организатора */
            int gameCreatorId = -1;

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

            /* Проверка, является ли пользователь участником матча */
            ApUserGame apUserGamePt = _unitOfWork.ApUserGameRepository.GetItems()
                                                                      .FirstOrDefault(apug => apug.PkFkGameId == gameId
                                                                       && apug.PkFkUserId == userid
                                                                       && apug.PkUserType == "participant");

            /* Получаем организатора матча и проверяем является ли пользователь организатором матча */
            ApUserGame gameCreator = _unitOfWork.ApUserGameRepository.GetGameCreator(gameId);
            if(gameCreator != null)
            {
                gameCreatorId = gameCreator.PkFkUserId;

                if (userid == gameCreator.PkFkUserId)
                    isCreator = true;
            }
            
            if (apUserGamePt != null) 
            {
                isParticipant = true;
            }


            return Ok(new { currgame = game, 
                            isPart = isParticipant, 
                            isCreat = isCreator,
                            creatorID = gameCreatorId });
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

        [HttpGet]
        [Route("invit-users/{gameId}")]
        public ActionResult GetGameInvitUser(int gameId)
        {
            /* Получаю список пользователь, которых можо пригласить в матч */
            List<ApUser> gameInvitUsers = _unitOfWork.ApUserRepository.GetAllUsers();

            /* Получаю список участнииков матча */
            List<ApUser> gameParticipants = _unitOfWork.ApUserGameRepository.GetGameUsers(gameId);

            gameInvitUsers.RemoveAll(invitUser => gameParticipants.Any(partUser => partUser.PkId == invitUser.PkId));

            return Ok(gameInvitUsers);

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
            ApUserGame apUserGameEx = _unitOfWork.ApUserGameRepository.GetGameParticipant(gameId, userId);

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

        [Route("user-creat-game/{userId}")]
        [HttpGet]
        public IActionResult PostUserCreatMatch(int userId)
        {
            try
            {

                List<Game> games = _unitOfWork.ApUserGameRepository.GetItems()
                                                                   .Where(ap => ap.PkFkUserId == userId 
                                                                             && ap.PkUserType == "creator")
                                                                   .Select(ap => ap.Game)
                                                                   .ToList();

                if (games == null)
                    return BadRequest(new { message = "Пользователь не учавствует в матчах" });

                return Ok(games);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // ----------------------------------------------------------------------------------------------------------------------------------------- //

        [Route("user-part-game/{userId}")]
        [HttpGet]
        public IActionResult PostUserPartMatch(int userId)
        {
            try
            {

                List<Game> games = _unitOfWork.ApUserGameRepository.GetItems()
                                                                   .Where(ap => ap.PkFkUserId == userId
                                                                             && ap.PkUserType == "participant")
                                                                   .Select(ap => ap.Game)
                                                                   .ToList();

                if (games == null)
                    return BadRequest();

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
        public async Task<ActionResult> PostEditGame([FromBody] ShortGame shortGame)
        {
            if (HttpContext.User == null) { return BadRequest(); }

            int userId = int.Parse(HttpContext.User.Identity.Name);

            Game game = _unitOfWork.GameRepository.GetItem(shortGame.GameId);

            if (game == null)
            {
                return BadRequest();
            }

            game.Name = shortGame.GameName;
            game.DateTime = shortGame.GameDate;
            game.Format = shortGame.GameFormat;
            game.Adress = shortGame.GameAdress;

            DataBase.Models.Constant constant = _unitOfWork.ConstantRepository.GetConstantByName("editgame");
            if (constant != null) 
            {
                string notiffiMess = constant.StrValue.Replace("{game}", game.Name);

                /* Отправляю уведомление пользователям участникам матча */
                List<ApUser> gameUsers = _unitOfWork.ApUserGameRepository.GetGameUsers(shortGame.GameId);
                for (int i = 0; i < gameUsers.Count; i++)
                {
                    if (gameUsers[i].PkId == userId) { continue; }
                    await _notifications.Clients.User(Convert.ToString(gameUsers[i].PkId)).SendAsync("displayNotifi", notiffiMess);

                    Notification notification = new Notification(gameUsers[i].PkId, constant.Type, notiffiMess, game.PkId, userId);

                    _unitOfWork.NotificationRepository.AddElement(notification);
                }

            }

            _unitOfWork.Save();

            return Ok(new { message = "Данные успешно сохранены"});
        }

        // ------------------------------------------------------------------------------- //

        /* Не понятно, чтот это за метод */
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

            ApUserGame apUserGame = _unitOfWork.ApUserGameRepository.GetGameParticipant(gameId, userId);

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
        public async Task<ActionResult> DeleteGame(int id)
        {
            try
            {
                if (HttpContext.User == null) { return BadRequest(); }

                DataBase.Models.Constant constant = null;
                string notiffiMess = null;
                int userId = int.Parse(HttpContext.User.Identity.Name);

                /* Получаю пользователя, который удаляет матч */
                ApUser deletingUser = _unitOfWork.ApUserRepository.GetItem(userId);
                if (deletingUser == null) { return BadRequest(); }

                Game game = _unitOfWork.GameRepository.GetItem(id);
                if (game == null) { return BadRequest(new { message = "Данного матча не существует" });}

                List<ApUser> gameUsers = _unitOfWork.ApUserGameRepository.GetGameUsers(id);

                _unitOfWork.GameRepository.DeleteElement(id);
                _unitOfWork.Save();


                if (deletingUser.Role == "system")
                    constant = _unitOfWork.ConstantRepository.GetConstantByName("DeleteGameAdmin");
                else
                    constant = _unitOfWork.ConstantRepository.GetConstantByName("deletegame");

                if(constant != null)
                    notiffiMess = constant.StrValue.Replace("{game}", game.Name);

                /* Отправляю уведомление пользователям участникам матча */
                for (int i = 0; i < gameUsers.Count; i++)
                {
                    if(constant != null && gameUsers[i].PkId != userId)
                    {
                        await _notifications.Clients.User(Convert.ToString(gameUsers[i].PkId)).SendAsync("displayNotifiError", notiffiMess);
                        _gameHub.Clients.Group(Convert.ToString(game.PkId)).SendAsync("deleteGame");
                        Notification notification = new Notification(gameUsers[i].PkId, constant.Type, notiffiMess, id, userId);
                        _unitOfWork.NotificationRepository.AddElement(notification);
                    }
                }

                _unitOfWork.Save();
                return Ok();

            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // ------------------------------------------------------------------------------- //

        [HttpDelete]
        [Route("delete-game-user/{gameId}/{userId}")]
        public ActionResult DeleteUserFromGame(int gameId, int userId)
        {
            try
            {
                if (HttpContext.User == null) { return BadRequest(); }

                DataBase.Models.Constant notifiConstant = null;
            
                int deletingUserId = int.Parse(HttpContext.User.Identity.Name);
                int deleteUserId   = 0;

                /* Получаю пользователя, который удаляет пользователя из матча */
                ApUser deletingUser = _unitOfWork.ApUserRepository.GetItem(deletingUserId);
                if(deletingUser == null) { return BadRequest(); }

                /* Получаю матч, с которой хотят удалить пользователя */
                Game game = _unitOfWork.GameRepository.GetItem(gameId);
                if(game == null) { return BadRequest(); }

                /* Получаю записть участника матча */
                ApUserGame gameUser = _unitOfWork.ApUserGameRepository.GetGameParticipant(gameId, userId);
                if (gameUser == null) { return BadRequest(); }

                deleteUserId = gameUser.PkFkUserId;

                _unitOfWork.ApUserGameRepository.DeleteElement(gameUser);

                if (game.CurrPlayers > 0)
                    game.CurrPlayers -= 1;
                
                _unitOfWork.Save();

                if (deletingUser.Role == "system")
                    notifiConstant = _unitOfWork.ConstantRepository.GetConstantByName("DeleteUserFromGameAdmin");
                else
                    notifiConstant = _unitOfWork.ConstantRepository.GetConstantByName("deleteuserfromgame");


                if(notifiConstant != null)
                {
                    string notiffiMess = notifiConstant.StrValue.Replace("{game}", game.Name);
                    _notifications.Clients.User(Convert.ToString(deleteUserId)).SendAsync("displayNotifiError", notiffiMess);
                    _gameHub.Clients.User(Convert.ToString(deleteUserId)).SendAsync("refreshgame");
                    
                    Notification notification = new Notification(deleteUserId, notifiConstant.Type, notiffiMess, game.PkId, deletingUserId);
                    _unitOfWork.NotificationRepository.AddElement(notification);
                }

                _unitOfWork.Save();
                return Ok(new {message = "Пользователь удален из матча!"});
            }
            catch (Exception ex)
            {
                return BadRequest();
            }

            return Ok();
        }
    }
}
