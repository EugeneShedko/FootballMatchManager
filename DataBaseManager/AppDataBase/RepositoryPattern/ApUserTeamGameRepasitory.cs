using DataBaseManager.AppDataBase.Context;
using DataBaseManager.AppDataBase.Models;
using DataBaseManager.Utilts;
using Microsoft.EntityFrameworkCore;

namespace DataBaseManager.AppDataBase.RepositoryPattern
{
    public class ApUserTeamGameRepasitory
    {
        private AppDBContext _dbcontext;

        public ApUserTeamGameRepasitory(AppDBContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public void AddElement(ApUserTeamGame item)
        {
            _dbcontext.ApUserTeamGames.Add(item);
        }

        public void DeleteElement(int firstid, int secondid = 0)
        {
            ApUserTeamGame deleteapusergame = _dbcontext.ApUserTeamGames.Find(firstid, secondid);
            if (deleteapusergame != null)
            {
                _dbcontext.ApUserTeamGames.Remove(deleteapusergame);
            }
        }

        public void DeleteElement(ApUserTeamGame deleteapusergame)
        {
            if (deleteapusergame != null)
            {
                _dbcontext.ApUserTeamGames.Remove(deleteapusergame);
            }
        }

        public ApUserTeamGame GetItem(int firstid, int secondid = 0)
        {
            return _dbcontext.ApUserTeamGames.Find(firstid, secondid);
        }

        public IEnumerable<ApUserTeamGame> GetItems()
        {
            return _dbcontext.ApUserTeamGames.Include(up => up.ApUser)
                                             .Include(up => up.TeamGame)
                                             .ToList();
        }

        public IEnumerable<ApUserTeamGame> GetItems2()
        {
            return _dbcontext.ApUserTeamGames.Include(up => up.ApUser)
                                             .Include(up => up.TeamGame)
                                                .ThenInclude(t => t.FirstTeam)
                                             .Include(up => up.TeamGame)
                                                .ThenInclude(t => t.SecondTeam)
                                             .ToList();

        }

        public void UpdateElement(ApUserTeamGame item)
        {
            _dbcontext.Entry(item).State = EntityState.Modified;
        }

        // ------------------------------------------------------------ //

        /* Возвращает запись организатора командного матча по идентификатору командного матча */
        public ApUserTeamGame GetTeamGameCreatorRecord(int teamGameId)
        {
            return GetItems().FirstOrDefault(aputg => aputg.PkFkTeamGameId == teamGameId
                                                   && aputg.PkFkUserType == (int)ApUserGameTypeEnum.CREATOR);
        }

        // ------------------------------------------------------------ //

        /* Возвращает запись участника командного матча по его айди и айди матча */
        public ApUserTeamGame GetTeamGameParticiapnt(int teamGameId, int userId)
        {
            return GetItems().FirstOrDefault(aputg => aputg.PkFkTeamGameId == teamGameId
                                                   && aputg.PkFkUserId == userId
                                                   && aputg.PkFkUserType == (int)ApUserGameTypeEnum.PARTICIPANT);
        }

        /// <summary>
        /// Возвращает список матчей в которых пользователь является участником
        /// </summary>
        /// <param name="userId">Айди пользователя</param>
        /// <returns></returns>
        public List<TeamGame> GetPartUserTeamGames(int userId)
        {
            return GetItems2().Where(aputg => aputg.PkFkUserId == userId
                                          && aputg.PkFkUserType == (int)ApUserGameTypeEnum.PARTICIPANT)
                             .Select(aputg => aputg.TeamGame)
                             .ToList();
        }

        /// <summary>
        /// Возвращает список матчей в которых пользователья является участником в определенном статусе матча
        /// </summary>
        /// <param name="userId">Айди пользователя</param>
        /// <param name="teamGameStatus">Статус матча</param>
        /// <returns></returns>
        public List<TeamGame> GetUserPartTeamGamesByGameStatus(int userId, int teamGameStatus)
        {

            if ((teamGameStatus == (int)TeamGameStatus.WAIT) || (teamGameStatus == (int)TeamGameStatus.SEARCH))
                return GetItems2().Where(aputg => aputg.PkFkUserId == userId
                                               && aputg.PkFkUserType == (int)ApUserGameTypeEnum.PARTICIPANT
                                               && aputg.TeamGame.Status == teamGameStatus)
                              .OrderBy(aputg => aputg.TeamGame.DateTime)
                              .Select(aputg => aputg.TeamGame)
                              .ToList();

            if ((teamGameStatus == (int)TeamGameStatus.COMPLETED) || (teamGameStatus == (int)TeamGameStatus.FINISHED))
                return GetItems2().Where(aputg => aputg.PkFkUserId == userId
                                               && aputg.PkFkUserType == (int)ApUserGameTypeEnum.PARTICIPANT
                                               && aputg.TeamGame.Status == teamGameStatus)
                              .OrderByDescending(aputg => aputg.TeamGame.DateTime)
                              .Select(aputg => aputg.TeamGame)
                              .ToList();

            return GetItems2().Where(aputg => aputg.PkFkUserId == userId
                                          && aputg.PkFkUserType == (int)ApUserGameTypeEnum.PARTICIPANT
                                          && aputg.TeamGame.Status == teamGameStatus)
              .OrderBy(aputg => aputg.TeamGame.DateTime)
              .Select(aputg => aputg.TeamGame)
              .ToList();
        }

        /// <summary>
        /// Возвращает список командных матчей в которых пользователь является организатором
        /// </summary>
        /// <param name="userId">Айди пользователя</param>
        /// <returns></returns>

        public List<TeamGame> GetCreatUserTeamGames(int userId)
        {
            return GetItems2().Where(aputg => aputg.PkFkUserId == userId
                                           && aputg.PkFkUserType == (int)ApUserGameTypeEnum.CREATOR)
                             .Select(aputg => aputg.TeamGame).ToList();
        }

        /// <summary>
        /// Возвращает список участников командного матча по айди матча
        /// </summary>
        /// <param name="teamGameId"> Идентификатор командного матча </param>
        /// <returns></returns>

        public List<ApUser> GetTeamGameParticipants(int teamGameId)
        {
            return GetItems().Where(aputg => aputg.PkFkTeamGameId == teamGameId
                                   && aputg.PkFkUserType == (int)ApUserGameTypeEnum.PARTICIPANT)
                      .Select(aputg => aputg.ApUser)
                      .ToList();
        }

        // ------------------------------------------------------------ //

    }
}
