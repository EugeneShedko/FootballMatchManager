﻿using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
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

        /* Скорее всего на отдельное действие отдельную логику прописывать нужно */
        /* Констунту сообщения скорее всего не обязательно писать, для каждого своя будет видимо */
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
                //notifiId = int.Parse(inNotifiId);
                notifiId = inNotifiId;
                Notification reqNotifi = _unitOfWork.NotificationRepository.GetItem(notifiId);

                if (reqNotifi == null) { return; }

                /* ! Плохо, что задаю константу здесь в коде */
                /* ! Можно создать отдельный класс, где будут прописаны имена констант и их значения*/
                /* Получаю константу, в которой хранится текст сообщения */
                Constant constant = _unitOfWork.ConstantRepository.GetConstantByName("acceptreqgame");

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
                //notifiId = int.Parse(inNotifiId);
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
            catch (Exception e) 
            {
                return;
            }
        }

        /* Добавление/Покидание матча/Запрос на участие в матче  */
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

                /*
                Constant constant = _unitOfWork.ConstantRepository.GetItems()
                                                                  .FirstOrDefault(c => c.Name == constname);
                */

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
    }
}
