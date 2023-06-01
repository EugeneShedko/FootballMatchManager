﻿using FootballMatchManager.DataBase.DBClasses;
using FootballMatchManager.DataBase.Models;
using FootballMatchManager.Enums;
using Microsoft.EntityFrameworkCore;

namespace FootballMatchManager.AppDataBase.RepositoryPattern
{
    public class ApUserGameRepository : IRepository<ApUserGame>
    {
        private AppDBContext _dbcontext;

        public ApUserGameRepository(AppDBContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public void AddElement(ApUserGame item)
        {
            _dbcontext.ApUsersGames.Add(item);
        }

        public void DeleteElement(int firstid, int secondid = 0)
        {
            ApUserGame deleteapusergame = _dbcontext.ApUsersGames.Find(firstid, secondid);
            if (deleteapusergame != null)
            {
                _dbcontext.ApUsersGames.Remove(deleteapusergame);
            }
        }

        public void DeleteElement(ApUserGame deleteapusergame)
        {
             if (deleteapusergame != null)
             {
                 _dbcontext.ApUsersGames.Remove(deleteapusergame);
             }
        }

        public ApUserGame GetItem(int firstid, int secondid = 0)
        {
            return _dbcontext.ApUsersGames.Find(firstid, secondid);
        }

        public IEnumerable<ApUserGame> GetItems()
        {
            return _dbcontext.ApUsersGames.Include(up => up.ApUser)
                                          .Include(up => up.Game)
                                          .ToList();
        }

        public void UpdateElement(ApUserGame item)
        {
            _dbcontext.Entry(item).State= EntityState.Modified;
        }

        /// <summary>
        /// Возвращает список участников матча
        /// </summary>
        /// <param name="gameid">Айди матча</param>
        /// <returns></returns>
        public List<ApUser> GetGameUsers(int gameid)
        {
            return GetItems().Where(apug => apug.PkFkGameId == gameid
                                         && apug.PkUserType == "participant")
                             .Select(apug => apug.ApUser)
                             .ToList();

        }


        /// <summary>
        /// Возвращает запись участника матча
        /// </summary>
        /// <param name="gameId">Айди матча</param>
        /// <param name="userId">Айди пользователя</param>
        /// <returns></returns>

        public ApUserGame GetGameParticipant(int gameId, int userId)
        {
            return GetItems().FirstOrDefault(apug => apug.PkFkGameId == gameId
                                                  && apug.PkFkUserId == userId
                                                  && apug.PkUserType == "participant");
        }
        /// <summary>
        /// Возвращает список матчей в которых пользователь является участником
        /// </summary>
        /// <param name="userId">Айди пользователя</param>
        /// <returns></returns>
        public List<Game> GetUserPartGame(int userId)
        {
            return GetItems().Where(ap => ap.PkFkUserId == userId
                                       && ap.PkUserType == ApUserGameType.Partisipant)
                             .Select(ap => ap.Game)
                             .ToList();
        }

        /// <summary>
        /// Возвращает список матчей в которых пользователь является участником в определенном статусе матча
        /// </summary>
        /// <param name="userId">Айди пользователя</param>
        /// <param name="status">Статус матча</param>
        /// <returns></returns>

        public List<Game> GetUserPartGameByGameStatus(int userId, int status)
        {
            if (status == (int)TeamGameStatus.WAIT)
                return GetItems().Where(apug => apug.PkFkUserId == userId
                                         && apug.PkUserType == ApUserGameType.Partisipant
                                         && apug.Game.Status == status)
                              .OrderBy(apug => apug.Game.DateTime)
                              .Select(apug => apug.Game)
                              .ToList();
            
            if (status == (int)TeamGameStatus.COMPLETED)
                return GetItems().Where(apug => apug.PkFkUserId == userId
                                         && apug.PkUserType == ApUserGameType.Partisipant
                                         && apug.Game.Status == status)
                              .OrderByDescending(apug => apug.Game.DateTime)
                              .Select(apug => apug.Game)
                              .ToList();

            if (status == (int)TeamGameStatus.FINISHED)
                return GetItems().Where(apug => apug.PkFkUserId == userId
                                             && apug.PkUserType == ApUserGameType.Partisipant
                                             && apug.Game.Status == status)
                                 .OrderByDescending(apug => apug.Game.DateTime)
                                 .Select(apug => apug.Game)
                                 .ToList();

            return GetItems().Where(apug => apug.PkFkUserId == userId
                                         && apug.PkUserType == ApUserGameType.Partisipant
                                         && apug.Game.Status == status)
                             .Select(apug => apug.Game)
                             .ToList();


        }

        /// <summary>
        /// Возвращает запись организатора матча
        /// </summary>
        /// <param name="gameId">Айди матча</param>
        /// <returns></returns>
        public ApUserGame GetGameCreator(int gameId)
        {
            return GetItems().FirstOrDefault(apug => apug.PkFkGameId == gameId
                                                  && apug.PkUserType == ApUserGameType.Creator);
        }

    }
}
