using FootballMatchManager.AppDataBase.Models;
using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.DataBase.Models;
using FootballMatchManager.Utilts;
using Microsoft.AspNetCore.SignalR;

namespace FootballMatchManager.Hubs
{
    public class NotificationHub : Hub
    {
        UnitOfWork _unitOfWork;

        public NotificationHub(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task AcceptReqGame(int inNotifiId)
        {
            try
            {
                int notifiId;
                int userIdSender;

                if (Context.User == null) { return; }

                /* Айди пользователя, отправляющего ответ */
                userIdSender = int.Parse(Context.User.Identity.Name);

                /* Получаем отправленный запрос на участие */
                notifiId = inNotifiId;
                Notification reqNotifi = _unitOfWork.NotificationRepository.GetItem(notifiId);

                if (reqNotifi == null) { return; }

                if (reqNotifi.EntityId == null) { return; }

                /* ! Плохо, что задаю константу здесь в коде */
                /* ! Можно создать отдельный класс, где будут прописаны имена констант и их значения*/
                /* Получаю константу, в которой хранится текст сообщения */
                Constant constant = _unitOfWork.ConstantRepository.GetConstantByName("acceptreqgame");

                if (constant == null) { return; }

                /* Получаем игру с которой связан запрос */
                Game game = _unitOfWork.GameRepository.GetItem((int)reqNotifi.EntityId);

                /* Формирую текст уведомления */
                string notiffiMess = constant.StrValue.Replace("{user}", reqNotifi.Recipient.FirstName + ' ' + reqNotifi.Recipient.LastName)
                                                      .Replace("{game}", game.Name);

                /* Создаю новый объект уведомления */
                Notification notification = new Notification(reqNotifi.FkSenderId, constant.Type, notiffiMess, (int)reqNotifi.EntityId, userIdSender);

                _unitOfWork.NotificationRepository.AddElement(notification);
                _unitOfWork.Save();

                /* Отправляем уведомление пользователю */
                await Clients.User(Convert.ToString(reqNotifi.FkSenderId))?.SendAsync("displayNotifi", notiffiMess);
            }
            catch (Exception e)
            {
                return;
            }
        }

        public async Task DismissReqGame(int inNotifiId)
        {
            try
            {
                int notifiId;
                int userIdSender;

                if (Context.User == null) { return; }

                /* Айди пользователя, отправляющего ответ */
                userIdSender = int.Parse(Context.User.Identity.Name);

                /* Получаем отправленный запрос на участие */
                notifiId = inNotifiId;
                Notification reqNotifi = _unitOfWork.NotificationRepository.GetItem(notifiId);

                if(reqNotifi == null) { return; }

                /* ! Плохо, что задаю константу здесь в коде */
                /* ! Можно создать отдельный класс, где будут прописаны имена констант и их значения*/
                /* Получаю константу, в которой хранится текст сообщения */
                Constant constant = _unitOfWork.ConstantRepository.GetConstantByName("dismissreqgame");

                if(constant == null) { return; }

                if(reqNotifi.EntityId == null) { return; }

                /* Получаем игру с которой связан запрос */
                Game game = _unitOfWork.GameRepository.GetItem((int)reqNotifi.EntityId);

                /* Формирую текст уведомления */
                string notiffiMess = constant.StrValue.Replace("{user}", reqNotifi.Recipient.FirstName + ' ' + reqNotifi.Recipient.LastName)
                                                      .Replace("{game}", game.Name);

                /* Создаю новый объект уведомления */
                Notification notification = new Notification(reqNotifi.FkSenderId, constant.Type, notiffiMess, (int)reqNotifi.EntityId, userIdSender);

                _unitOfWork.NotificationRepository.AddElement(notification);
                _unitOfWork.Save();

                /* Отправляем уведомление пользователю */
                await Clients.User(Convert.ToString(reqNotifi.FkSenderId))?.SendAsync("displayNotifi", notiffiMess);
            }
            catch (Exception ex) 
            {
                return;
            }
        }

        /* Добавление/Покидание матча/Запрос на участие в матче  */
        /* Хреново, что на столько запросов один метод используется */
        public async Task Game(string igameid, string constname)
        {
            int gameid;
            int userIdSender;
            string notiffiMess;

            try 
            { 

                if(Context.User == null) { return; }

                gameid = int.Parse(igameid);

                userIdSender = int.Parse(Context.User.Identity.Name);

                /* Получаем организатора матча */
                ApUserGame apUserGame = _unitOfWork.ApUserGameRepository.GetItems()
                                                                        .FirstOrDefault(apug => apug.PkFkGameId == gameid
                                                                                             && apug.PkUserType == "creator");
                if (apUserGame == null) { return; }

                /* Получаем отправителя уведомления */
                ApUser apUserSender = _unitOfWork.ApUserRepository.GetItem(userIdSender);

                if(apUserSender == null) { return; }

                /* Получаем сообщение для уведомления */

                Constant constant = _unitOfWork.ConstantRepository.GetConstantByName(constname);


                if (constant == null) { return; }

                /* Формируем текст уведомления */
                notiffiMess = constant.StrValue.Replace("{user}", apUserSender.FirstName + ' ' + apUserSender.LastName)
                                               .Replace("{game}", apUserGame.Game.Name);

                /* тип в константы добавлен специально для уведомлений */
                Notification notifi = new Notification(apUserGame.PkFkUserId, constant.Type, notiffiMess, gameid, apUserSender.PkId);

                _unitOfWork.NotificationRepository.AddElement(notifi);
                _unitOfWork.Save();

   
                await Clients.User(Convert.ToString(apUserGame.PkFkUserId))?.SendAsync("displayNotifi", notiffiMess);

            }
            catch (Exception ex)
            {
                return;
            }
        }
        public async Task RequestToAddTeam(int teamId)
        {

            try
            {
                int userIdSender;
                string notiffiMess;

                if (Context.User == null) { return; }

                userIdSender = int.Parse(Context.User.Identity.Name);

                if(_unitOfWork.ApUserTeamRepository.GetTeamsByParticipant(userIdSender).Count >= 3 )
                {
                    Constant errorReq = _unitOfWork.ConstantRepository.GetConstantByName("errorreqteam");

                    if (errorReq != null)
                    {
                        await Clients.User(Context.User.Identity.Name)?.SendAsync("displayNotifi", errorReq.StrValue);
                        return;
                    }
                }

                /* Получаем создателя матча */
                ApUserTeam apUserTeam = _unitOfWork.ApUserTeamRepository.GetTeamCreator(teamId);

                if (apUserTeam == null) { return; }

                /* Получаем отправителя уведомления */
                ApUser apUserSender = _unitOfWork.ApUserRepository.GetItem(userIdSender);

                if (apUserSender == null) { return; }

                /* Получаем сообщение уведомления */
                Constant constant = _unitOfWork.ConstantRepository.GetConstantByName("requestforteam");

                if (constant == null) { return; }

                /* Формируем текст уведомления */
                notiffiMess = constant.StrValue.Replace("{user}", apUserSender.FirstName + ' ' + apUserSender.LastName)
                                               .Replace("{team}", apUserTeam.Team.Name);

                /* тип в константы добавлен специально для уведомлений */
                Notification notifi = new Notification(apUserTeam.PkFkUserId, constant.Type, notiffiMess, teamId, apUserSender.PkId);

                _unitOfWork.NotificationRepository.AddElement(notifi);
                _unitOfWork.Save();

                /* Отправляем уведомление пользователю организатору комануды */
                await Clients.User(Convert.ToString(apUserTeam.PkFkUserId))?.SendAsync("displayNotifi", notiffiMess);

                /* Получаем констанут для отправки сообщения пользователю, который отправил запрос */
                Constant sendReq = _unitOfWork.ConstantRepository.GetConstantByName("teamreqsend");

                if (sendReq == null) { return;}

                string sendMsg = sendReq.StrValue.Replace("{team}", apUserTeam.Team.Name);

                await Clients.User(Context.User.Identity.Name)?.SendAsync("displayNotifi", sendMsg);

            }
            catch(Exception ex)
            {
                return;
            }
        }
        public async Task AcceptReqTeam(int inNotifiId)
        {
            int notifiId;
            int userIdSender;

            if (Context.User == null) { return; }

            /* Айди пользователя, отправляющего ответ */
            userIdSender = int.Parse(Context.User.Identity.Name);

            /* Получаем отправленный запрос на участие */
            Notification reqNotifi = _unitOfWork.NotificationRepository.GetItem(inNotifiId);
            if (reqNotifi == null) { return; }

            Constant constant = _unitOfWork.ConstantRepository.GetConstantByName("acceptregteam");

            if (constant == null) { return; }

            if (reqNotifi.EntityId == null) { return; }

            /* Получаем комнду с которой связан запрос */
            Team team = _unitOfWork.TeamRepository.GetItem((int)reqNotifi.EntityId);

            /* Формирую текст уведомления */
            string notiffiMess = constant.StrValue.Replace("{user}", reqNotifi.Recipient.FirstName + ' ' + reqNotifi.Recipient.LastName)
                                                  .Replace("{team}", team.Name);

            /* Создаю новый объект уведомления */
            Notification notification = new Notification(reqNotifi.FkSenderId, constant.Type, notiffiMess, (int)reqNotifi.EntityId, userIdSender);
            _unitOfWork.NotificationRepository.AddElement(notification);
            _unitOfWork.Save();

            await Clients.User(Convert.ToString(reqNotifi.FkSenderId))?.SendAsync("displayNotifi", notiffiMess);

        }
        public async Task DismissReqTeam(int inNotifiId)
        {
            try
            {
                int userIdSender;
                if (Context.User == null) { return; }

                /* Айди пользователя, отправляющего ответ */
                userIdSender = int.Parse(Context.User.Identity.Name);

                /* Получаем отправленный запрос на участие */
                Notification reqNotifi = _unitOfWork.NotificationRepository.GetItem(inNotifiId);

                if (reqNotifi == null) { return; }

                Constant constant = _unitOfWork.ConstantRepository.GetConstantByName("dismissregteam");

                if (constant == null) { return; }

                if (reqNotifi.EntityId == null) { return; }

                /* Получаем комнду с которой связан запрос */
                Team team = _unitOfWork.TeamRepository.GetItem((int)reqNotifi.EntityId);

                /* Формирую текст уведомления */
                string notiffiMess = constant.StrValue.Replace("{user}", reqNotifi.Recipient.FirstName + ' ' + reqNotifi.Recipient.LastName)
                                                      .Replace("{team}", team.Name);

                /* Создаю новый объект уведомления */
                Notification notification = new Notification(reqNotifi.FkSenderId, constant.Type, notiffiMess, (int)reqNotifi.EntityId, userIdSender);

                _unitOfWork.NotificationRepository.AddElement(notification);
                _unitOfWork.Save();

                /* Отправляем уведомление пользователю */
                await Clients.User(Convert.ToString(reqNotifi.FkSenderId))?.SendAsync("displayNotifi", notiffiMess);

            }
            catch (Exception ex)
            {
                return;
            }
        }
        public async Task RequestToAddTeamGame(int teamGameId)
        {
            try
            {
                int userIdSender;

                if (Context.User == null) { return; }

                userIdSender = int.Parse(Context.User.Identity.Name);

                /* Получаем запись организатора командного матча */
                ApUserTeamGame userCreatRec = _unitOfWork.ApUserTeamGameRepasitory.GetTeamGameCreatorRecord(teamGameId);

                if (userCreatRec == null) { return; }

                /* Получаем отправителя уведомления */
                ApUser apUserSender = _unitOfWork.ApUserRepository.GetItem(userIdSender);

                if (apUserSender == null) { return; }

                /* Проверяем является ли пользователь организатором команды */
                ApUserTeam senderTeamCreat = _unitOfWork.ApUserTeamRepository.GetTeamCreatorByUserId(userIdSender);

                if (senderTeamCreat == null)
                {
                    /* !!!!! Потом добавить данную константу в таблицу Constant */
                    await Clients.User(Convert.ToString(userIdSender))?.SendAsync("displayNotifi", "Вы не может отправить запрос на присоединение к командной игре, так как не являетесь организатором команды");
                    return;
                }

                /* Получаю минимальное количество участников в матче */
                int minMembers = int.Parse(userCreatRec.TeamGame.Format.Substring(0, 1));

                if(senderTeamCreat.Team.MemberQnt < minMembers)
                {
                    await Clients.User(Convert.ToString(userIdSender))?.SendAsync("displayNotifi", "Вы не может отправить запрос на присоединение к командной игре, так как в вашей команде не достаточно участников");
                    return;
                }

                /* Получаем сообщение уведомления */
                Constant constant = _unitOfWork.ConstantRepository.GetConstantByName("requestforteamgame");

                if (constant == null) { return; }

                /* Формируем текст уведомления */
                /* Нужно получить еще наименование команды */
                /* Потом нужно еще добавить наименование матча */
                string notifiMess = constant.StrValue.Replace("{team}", senderTeamCreat.Team.Name);

                /* Создаем новое уведомление */
                Notification notifi = new Notification(userCreatRec.PkFkUserId, constant.Type, notifiMess, teamGameId, apUserSender.PkId);
                _unitOfWork.NotificationRepository.AddElement(notifi);
                _unitOfWork.Save();

                await Clients.User(Convert.ToString(userCreatRec.PkFkUserId))?.SendAsync("displayNotifi", notifiMess);

                Constant sendReq = _unitOfWork.ConstantRepository.GetConstantByName("teamgamereqsend");

                if(sendReq != null)
                {
                    await Clients.User(Convert.ToString(userIdSender))?.SendAsync("displayNotifi", sendReq.StrValue);
                }

            }
            catch(Exception ex)
            {
                return;
            }
        }
        public async Task DismissReqTeamGame(int inNotifiId)
        {
            try
            {
                int userIdSender;
                if (Context.User == null) { return; }

                /* Айди пользователя, отправляющего ответ */
                userIdSender = int.Parse(Context.User.Identity.Name);

                /* Получаем отправленный запрос на участие */
                Notification reqNotifi = _unitOfWork.NotificationRepository.GetItem(inNotifiId);

                if (reqNotifi == null) { return; }

                if (reqNotifi.EntityId == null) { return; }

                Constant constant = _unitOfWork.ConstantRepository.GetConstantByName("dismissreqteamgame");
                if (constant == null) { return; }

                /* Потом от сюда достать наименование */
                TeamGame team = _unitOfWork.TeamGameRepasitory.GetItem((int)reqNotifi.EntityId);

                /* Получаю команду организатора матча */
                Team teamOfCreat = _unitOfWork.ApUserTeamRepository.GetTeamByCreator(userIdSender);    

                if(teamOfCreat == null) { return; }

                /* Формируем текст уведомления */
                /* Добавить потом еще наименование к игре */
                string notiffiMess = constant.StrValue.Replace("{team}", teamOfCreat.Name);

                /* Создаю новый объект уведомления */
                Notification notification = new Notification(reqNotifi.FkSenderId, constant.Type, notiffiMess, (int)reqNotifi.EntityId, userIdSender);

                _unitOfWork.NotificationRepository.AddElement(notification);
                _unitOfWork.Save();

                await Clients.User(Convert.ToString(reqNotifi.FkSenderId))?.SendAsync("displayNotifi", notiffiMess);
                await Clients.User(Convert.ToString(userIdSender))?.SendAsync("displayNotifi", "Ваш ответ отправлен!");

            }
            catch(Exception ex)
            {
                return;
            }
        }

        public async Task AcceptReqTeamGame(int notifiId)
        {
            try
            {
                int userIdSender;
                if (Context.User == null) { return; }

                /* Айди пользователя, отправляющего ответ */
                userIdSender = int.Parse(Context.User.Identity.Name);

                /* Получаем отправленный запрос на участие */
                Notification reqNotifi = _unitOfWork.NotificationRepository.GetItem(notifiId);

                if (reqNotifi == null) { return; }

                if (reqNotifi.EntityId == null) { return; }

                /* Нужна новая константа */
                Constant constant = _unitOfWork.ConstantRepository.GetConstantByName("acceptreqteamgame");

                if (constant == null) { return; }

                TeamGame teamGame = _unitOfWork.TeamGameRepasitory.GetItem((int)reqNotifi.EntityId);

                /* Получаю команду организатора матча */
                Team teamOfCreat = _unitOfWork.ApUserTeamRepository.GetTeamByCreator(userIdSender);

                if (teamOfCreat == null) { return; }

                /* Формирую текст уведомления */
                /* !! Добавить потом наименование матча*/
                string notiffiMess = constant.StrValue.Replace("{user}", teamOfCreat.Name);

                /* Создаю новый объект уведомления */
                Notification notification = new Notification(reqNotifi.FkSenderId, constant.Type, notiffiMess, (int)reqNotifi.EntityId, userIdSender);
                _unitOfWork.NotificationRepository.AddElement(notification);
                _unitOfWork.Save();

                /* Отправляем уведомление пользователю */
                await Clients.User(Convert.ToString(reqNotifi.FkSenderId))?.SendAsync("displayNotifi", notiffiMess);
                await Clients.User(Convert.ToString(userIdSender))?.SendAsync("displayNotifi", "Ваш ответ отправлен!");
            }
            catch (Exception ex)
            {

            }
        }
        public async Task LeavFromTeamGame(int teamGameId)
        {
            try
            {
                int userIdSender;
                if (Context.User == null) { return; }

                /* Айди пользователя, отправляющего сообщ */
                userIdSender = int.Parse(Context.User.Identity.Name);

                /* Получаем командную игру */
                TeamGame teamGame = _unitOfWork.TeamGameRepasitory.GetItem(teamGameId);
                if(teamGame == null) { return; }

                /* Получаю организатора командного матча */
                ApUserTeamGame teamGameCreator = _unitOfWork.ApUserTeamGameRepasitory.GetTeamGameCreatorRecord(teamGameId);
                if(teamGameCreator == null) { return; }

                /* Получаю команду пользователя, покинувшего матч */
                Team teamCreator = _unitOfWork.ApUserTeamRepository.GetTeamByCreator(userIdSender);
                if(teamCreator == null) { return; }

                /* Получаю константу уведомления */
                Constant constant = _unitOfWork.ConstantRepository.GetConstantByName("leaveteamgame");
                if (constant == null) { return; }

                /* Наименование заменить */
                string notiffiMess = constant.StrValue.Replace("{team}", teamCreator.Name);

                /* Создаю новый объект уведомления */
                Notification notification = new Notification(teamGameCreator.PkFkUserId, constant.Type, notiffiMess, teamGame.PkId, userIdSender);
                _unitOfWork.NotificationRepository.AddElement(notification);
                _unitOfWork.Save();

                await Clients.User(Convert.ToString(teamGameCreator.PkFkUserId))?.SendAsync("displayNotifi", notiffiMess);
            }
            catch (Exception ex)
            {
                return;
            }
        }
        /* Приглашение пользователя в команду */
        public async Task InvitationToTeam(int invitedUser)
        {
            try
            {
                int userIdSender;
                string notiffiMess;

                if (Context.User == null) { return; }

                userIdSender = int.Parse(Context.User.Identity.Name);

                /* Получаю команду по айди организтара */
                Team team = _unitOfWork.ApUserTeamRepository.GetTeamByCreator(userIdSender);

                if(team == null)
                {
                    Constant errorMsg = _unitOfWork.ConstantRepository.GetConstantByName("errorinviteteam");
                    if (errorMsg == null) { return; }
 
                    await Clients.User(Context.User.Identity.Name)?.SendAsync("displayNotifiError", errorMsg.StrValue);
                    return;
                }

                /* Получаю пользователя организатора команды */
                ApUser teamCreator = _unitOfWork.ApUserRepository.GetItem(userIdSender);

                if(teamCreator == null) { return; }

                /* Получаю сообщение уведомления */
                Constant constant = _unitOfWork.ConstantRepository.GetConstantByName("requstforinviteteam");

                if (constant == null) { return; }

                /* Формируем текст уведомления */
                notiffiMess = constant.StrValue.Replace("{user}", teamCreator.FirstName + ' ' + teamCreator.LastName)
                                               .Replace("{team}", team.Name);

                /* тип в константы добавлен специально для уведомлений */
                /* Формирую уведомление */
                Notification notifi = new Notification(invitedUser, constant.Type, notiffiMess, team.PkId, teamCreator.PkId);

                _unitOfWork.NotificationRepository.AddElement(notifi);
                _unitOfWork.Save();

                /* Отправляем уведомление пользователю, которого приглашают в команду */
                await Clients.User(Convert.ToString(invitedUser))?.SendAsync("displayNotifi", notiffiMess);


                /* Получаем констанут для отправки сообщения пользователю, который отправил приглашение */
                Constant sendReq = _unitOfWork.ConstantRepository.GetConstantByName("teaminvitesend");
                if (sendReq == null) { return; }

                await Clients.User(Context.User.Identity.Name)?.SendAsync("displayNotifi", sendReq.StrValue);

            }
            catch (Exception ex)
            {
                return;
            }
        }
        public async Task DismissInvitationToTeam(int inNotifiId)
        {
            try
            {
                int userIdSender;
                if (Context.User == null) { return; }

                /* Айди пользователя, отправляющего ответ */
                userIdSender = int.Parse(Context.User.Identity.Name);

                /* Получаем отправленное приглашение на присоединение к команде */
                Notification reqNotifi = _unitOfWork.NotificationRepository.GetItem(inNotifiId);
                if (reqNotifi == null) { return; }

                /* Получаем константу уведомления */
                Constant constant = _unitOfWork.ConstantRepository.GetConstantByName("dismissinviteteam");
                if (constant == null) { return; }

                if (reqNotifi.EntityId == null) { return; }

                /* Получаем команду с которой связан запрос */
                Team team = _unitOfWork.TeamRepository.GetItem((int)reqNotifi.EntityId);

                /* Формирую текст уведомления */
                string notiffiMess = constant.StrValue.Replace("{user}", reqNotifi.Recipient.FirstName + ' ' + reqNotifi.Recipient.LastName)
                                                      .Replace("{team}", team.Name);

                /* Создаю новый объект уведомления */
                Notification notification = new Notification(reqNotifi.FkSenderId, constant.Type, notiffiMess, (int)reqNotifi.EntityId, userIdSender);

                _unitOfWork.NotificationRepository.AddElement(notification);
                _unitOfWork.Save();

                /* Отправляем уведомление пользователю */
                await Clients.User(Convert.ToString(reqNotifi.FkSenderId))?.SendAsync("displayNotifiError", notiffiMess);
            }
            catch (Exception ex)
            {
                return;
            }
        }
        public async Task AcceptInvitationToTeam(int inNotifiId)
        {
            try
            {
                int notifiId;
                int userIdSender;

                if (Context.User == null) { return; }

                /* Айди пользователя, отправляющего ответ */
                userIdSender = int.Parse(Context.User.Identity.Name);

                /* Получаем отправленное приглашение на присоединение к команде */
                Notification reqNotifi = _unitOfWork.NotificationRepository.GetItem(inNotifiId);
                if (reqNotifi == null) { return; }

                Constant constant = _unitOfWork.ConstantRepository.GetConstantByName("acceptinviteteam");
                if (constant == null) { return; }

                if (reqNotifi.EntityId == null) { return; }

                /* Получаем команду с которой связан запрос */
                Team team = _unitOfWork.TeamRepository.GetItem((int)reqNotifi.EntityId);

                /* Формирую текст уведомления */
                string notiffiMess = constant.StrValue.Replace("{user}", reqNotifi.Recipient.FirstName + ' ' + reqNotifi.Recipient.LastName)
                                                      .Replace("{team}", team.Name);

                /* Создаю новый объект уведомления */
                Notification notification = new Notification(reqNotifi.FkSenderId, constant.Type, notiffiMess, (int)reqNotifi.EntityId, userIdSender);
                _unitOfWork.NotificationRepository.AddElement(notification);
                _unitOfWork.Save();

                await Clients.User(Convert.ToString(reqNotifi.FkSenderId))?.SendAsync("displayNotifi", notiffiMess);

                /* Формирую и отправляю уведомление пользователю, который принял запрос */
                Constant successNotifi = _unitOfWork.ConstantRepository.GetConstantByName("acceptinviteteamsend");
                if(successNotifi == null) { return; }
                string successMess = successNotifi.StrValue.Replace("{team}", team.Name);

                await Clients.User(Convert.ToString(reqNotifi.FkRecipient))?.SendAsync("displayNotifi", successMess);

            }
            catch (Exception ex)
            {
                return;
            }
        }
        /* Приглашение пользователя в индивидуальный матча */
        public async Task InvitationToGame(int invitedUser, int gameId)
        {
            try
            {

                int userIdSender;
                string notiffiMess;

                if (Context.User == null) { return; }

                userIdSender = int.Parse(Context.User.Identity.Name);

                /* Получаю матч по идентификатору */
                Game game = _unitOfWork.GameRepository.GetItem(gameId);
                if (game == null) { return; }

                /* Получаю организатора по идентификаору */
                ApUser gameCreator = _unitOfWork.ApUserRepository.GetItem(userIdSender);
                if (gameCreator == null) { return; }

                /* Получаю сообщение уведомления */
                Constant constant = _unitOfWork.ConstantRepository.GetConstantByName("requesttoinvitegame");
                if (constant == null) { return; }

                /* Формируем текст уведомления */
                notiffiMess = constant.StrValue.Replace("{user}", gameCreator.FirstName + ' ' + gameCreator.LastName)
                                               .Replace("{game}", game.Name);

                /* тип в константы добавлен специально для уведомлений */
                /* Формирую уведомление */
                Notification notifi = new Notification(invitedUser, constant.Type, notiffiMess, game.PkId, gameCreator.PkId);

                _unitOfWork.NotificationRepository.AddElement(notifi);
                _unitOfWork.Save();

                /* Отправляем уведомление пользователю, которого приглашают в команду */
                await Clients.User(Convert.ToString(invitedUser))?.SendAsync("displayNotifi", notiffiMess);


                /* Получаем констанут для отправки сообщения пользователю, который отправил приглашение */
                Constant sendReq = _unitOfWork.ConstantRepository.GetConstantByName("teaminvitesend");
                if (sendReq == null) { return; }

                await Clients.User(Context.User.Identity.Name)?.SendAsync("displayNotifi", sendReq.StrValue);

            }
            catch (Exception ex)
            {
                return;
            }
        }
        public async Task DismissInvitationToGame(int inNotifiId)
        {
            try
            {
                int userIdSender;
                if (Context.User == null) { return; }

                /* Айди пользователя, отправляющего ответ */
                userIdSender = int.Parse(Context.User.Identity.Name);

                /* Получаем отправленное приглашение на присоединение к команде */
                Notification reqNotifi = _unitOfWork.NotificationRepository.GetItem(inNotifiId);
                if (reqNotifi == null) { return; }

                /* Получаем константу уведомления */
                Constant constant = _unitOfWork.ConstantRepository.GetConstantByName("dismissinvitegame");
                if (constant == null) { return; }

                if (reqNotifi.EntityId == null) { return; }

                /* Получаем игру с которой связан запрос */
                Game game = _unitOfWork.GameRepository.GetItem((int)reqNotifi.EntityId);

                /* Формирую текст уведомления */
                string notiffiMess = constant.StrValue.Replace("{user}", reqNotifi.Recipient.FirstName + ' ' + reqNotifi.Recipient.LastName)
                                                      .Replace("{game}", game.Name);

                /* Создаю новый объект уведомления */
                Notification notification = new Notification(reqNotifi.FkSenderId, constant.Type, notiffiMess, (int)reqNotifi.EntityId, userIdSender);

                _unitOfWork.NotificationRepository.AddElement(notification);
                _unitOfWork.Save();

                /* Отправляем уведомление пользователю */
                await Clients.User(Convert.ToString(reqNotifi.FkSenderId))?.SendAsync("displayNotifiError", notiffiMess);
            }
            catch (Exception ex)
            {
                return;
            }
        }
        public async Task AcceptInvitationToGame(int inNotifiId)
        {
            try
            {
                int notifiId;
                int userIdSender;

                if (Context.User == null) { return; }

                /* Айди пользователя, отправляющего ответ */
                userIdSender = int.Parse(Context.User.Identity.Name);

                /* Получаем отправленное приглашение на присоединение к матчу */
                Notification reqNotifi = _unitOfWork.NotificationRepository.GetItem(inNotifiId);
                if (reqNotifi == null) { return; }

                Constant constant = _unitOfWork.ConstantRepository.GetConstantByName("acceptinvitegame");
                if (constant == null) { return; }

                if (reqNotifi.EntityId == null) { return; }

                /* Получаем команду с которой связан запрос */
                Game game = _unitOfWork.GameRepository.GetItem((int)reqNotifi.EntityId);

                /* Формирую текст уведомления */
                string notiffiMess = constant.StrValue.Replace("{user}", reqNotifi.Recipient.FirstName + ' ' + reqNotifi.Recipient.LastName)
                                                      .Replace("{game}", game.Name);

                /* Создаю новый объект уведомления */
                Notification notification = new Notification(reqNotifi.FkSenderId, constant.Type, notiffiMess, (int)reqNotifi.EntityId, userIdSender);
                _unitOfWork.NotificationRepository.AddElement(notification);
                _unitOfWork.Save();

                await Clients.User(Convert.ToString(reqNotifi.FkSenderId))?.SendAsync("displayNotifi", notiffiMess);

                /* Формирую и отправляю уведомление пользователю, который принял запрос */
                Constant successNotifi = _unitOfWork.ConstantRepository.GetConstantByName("acceptinvitegamesend");
                if (successNotifi == null) { return; }
                string successMess = successNotifi.StrValue.Replace("{game}", game.Name);

                await Clients.User(Convert.ToString(reqNotifi.FkRecipient))?.SendAsync("displayNotifi", successMess);

            }
            catch (Exception ex)
            {
                return;
            }
        }
        /* Приглашение команды в командный матч */
        public async Task InvitationToTeamGame(int invitedTeam, int teamGameId)
        {
            try
            {
                int userIdSender;

                if (Context.User == null) { return; }

                userIdSender = int.Parse(Context.User.Identity.Name);

                /* Получаю игру в которую приглашаю команду */
                TeamGame teamGame = _unitOfWork.TeamGameRepasitory.GetItem(teamGameId);
                if(teamGame == null) { return; }

                /* Получаю организатора команды, которую приглашают в игр*/
                ApUser invitTeamCreator = _unitOfWork.ApUserTeamRepository.GetTeamCreatorObj(invitedTeam);
                if(invitTeamCreator == null) { return; }

                /* Получаю команду, которая приглашает в командный матч */
                Team sendTeam = _unitOfWork.ApUserTeamRepository.GetTeamByCreator(userIdSender);
                if(sendTeam == null) { return; }

                /* Получаю константу уведомления */
                Constant constant = _unitOfWork.ConstantRepository.GetConstantByName("requesttoinviteteamgame");
                if (constant == null) { return; }

                /* Формируем текст уведомления */
                string notifiMess = constant.StrValue.Replace("{team}", sendTeam.Name)
                                                     .Replace("{game}", teamGame.Name);

                Notification notifi = new Notification(invitTeamCreator.PkId, constant.Type, notifiMess, teamGameId, userIdSender);
                _unitOfWork.NotificationRepository.AddElement(notifi);
                _unitOfWork.Save();

                await Clients.User(Convert.ToString(invitTeamCreator.PkId))?.SendAsync("displayNotifi", notifiMess);

                /* Уведолмние пользователю, который отправил приглашение */
                Constant sendReq = _unitOfWork.ConstantRepository.GetConstantByName("teaminvitesend");
                if (sendReq != null)
                {
                    await Clients.User(Convert.ToString(userIdSender))?.SendAsync("displayNotifi", sendReq.StrValue);
                }
            }
            catch (Exception ex)
            {
                return;
            }
        }
        public async Task DismissInvitationToTeamGame(int inNotifiId)
        {
            try
            {
                int userIdSender;
                if (Context.User == null) { return; }

                /* Айди пользователя, отправляющего ответ */
                userIdSender = int.Parse(Context.User.Identity.Name);

                /* Получаем отправленное приглашение на присоединение к командному матчу */
                Notification reqNotifi = _unitOfWork.NotificationRepository.GetItem(inNotifiId);
                if (reqNotifi == null) { return; }

                /* Получаем команду пользователя, отвечающего на приглашение */
                Team team = _unitOfWork.ApUserTeamRepository.GetTeamByCreator(userIdSender);
                if(team == null) { return; }

                /* Получаем константу уведомления */
                Constant constant = _unitOfWork.ConstantRepository.GetConstantByName("dismissinviteteamgame");
                if (constant == null) { return; }

                if (reqNotifi.EntityId == null) { return; }

                TeamGame game = _unitOfWork.TeamGameRepasitory.GetItem((int)reqNotifi.EntityId);

                /* Формирую текст уведомления */
                string notiffiMess = constant.StrValue.Replace("{team}", team.Name)
                                                      .Replace("{game}", game.Name);

                /* Создаю новый объект уведомления */
                Notification notification = new Notification(reqNotifi.FkSenderId, constant.Type, notiffiMess, (int)reqNotifi.EntityId, userIdSender);

                _unitOfWork.NotificationRepository.AddElement(notification);
                _unitOfWork.Save();

                /* Отправляем уведомление пользователю */
                await Clients.User(Convert.ToString(reqNotifi.FkSenderId))?.SendAsync("displayNotifiError", notiffiMess);
            }
            catch (Exception ex)
            {
                return;
            }
        }
        public async Task AcceptInvitationToTeamGame(int inNotifiId)
        {
            try
            {
                int userIdSender;
                if (Context.User == null) { return; }

                /* Айди пользователя, отправляющего ответ */
                userIdSender = int.Parse(Context.User.Identity.Name);

                /* Получаем отправленное приглашение на присоединение к командному матчу */
                Notification reqNotifi = _unitOfWork.NotificationRepository.GetItem(inNotifiId);
                if (reqNotifi == null) { return; }

                /* Получаем команду пользователя, отвечающего на приглашение */
                Team team = _unitOfWork.ApUserTeamRepository.GetTeamByCreator(userIdSender);
                if (team == null) { return; }

                /* Получаем константу уведомления */
                Constant constant = _unitOfWork.ConstantRepository.GetConstantByName("acceptinviteteamgame");
                if (constant == null) { return; }

                if (reqNotifi.EntityId == null) { return; }

                TeamGame game = _unitOfWork.TeamGameRepasitory.GetItem((int)reqNotifi.EntityId);

                /* Формирую текст уведомления */
                string notiffiMess = constant.StrValue.Replace("{team}", team.Name)
                                                      .Replace("{game}", game.Name);

                /* Создаю новый объект уведомления */
                Notification notification = new Notification(reqNotifi.FkSenderId, constant.Type, notiffiMess, (int)reqNotifi.EntityId, userIdSender);

                _unitOfWork.NotificationRepository.AddElement(notification);
                _unitOfWork.Save();

                /* Отправляем уведомление пользователю */
                await Clients.User(Convert.ToString(reqNotifi.FkSenderId))?.SendAsync("displayNotifi", notiffiMess);

                /* Формирую и отправляю уведомление пользователю, который принял запрос */
                Constant successNotifi = _unitOfWork.ConstantRepository.GetConstantByName("acceptinviteteamgamesend");
                if (successNotifi == null) { return; }
                string successMess = successNotifi.StrValue.Replace("{game}", game.Name);

                await Clients.User(Convert.ToString(reqNotifi.FkRecipient))?.SendAsync("displayNotifi", successMess);
            }
            catch (Exception ex)
            {
                return;
            }
        }
    }
}
