using FootballMatchManager.AppDataBase.Models;
using FootballMatchManager.DataBase.DBClasses;
using FootballMatchManager.DataBase.Models;
using Microsoft.EntityFrameworkCore;

namespace FootballMatchManager.AppDataBase.RepositoryPattern
{
    public class TeamGameRepasitory
    {
        private AppDBContext _dbcontext;

        public TeamGameRepasitory(AppDBContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public void AddElement(TeamGame item)
        {
            _dbcontext.TeamsGames.Add(item);
        }

        public void DeleteElement(int firstid, int secondid = 0)
        {
            TeamGame deleteGame = _dbcontext.TeamsGames.Find(firstid);
            if (deleteGame != null)
            {
                _dbcontext.TeamsGames.Remove(deleteGame);
            }
        }

        public TeamGame GetItem(int firstid, int secondid = 0)
        {
            return _dbcontext.TeamsGames.Include(t => t.FirstTeam)
                                        .Include(t => t.SecondTeam)
                                        .FirstOrDefault(tg => tg.PkId == firstid);
        }

        public IEnumerable<TeamGame> GetItems()
        {
            return _dbcontext.TeamsGames.Include(t => t.FirstTeam)
                                        .Include(t => t.SecondTeam)
                                        .ToList();
        }

        public void UpdateElement(TeamGame item)
        {
            _dbcontext.Entry(item).State = EntityState.Modified;
        }

        // ---------------------------------------------------------- //

        /* Возвращает список всех командных матчей */
        public List<TeamGame> GetAllTeamGames()
        {
            return GetItems().OrderByDescending(tg => tg.DateTime).ToList();
        }

        // ---------------------------------------------------------- //

        /* Пока что удаляю не со всех матчей */

        /// <summary>
        /// Возвращает список командных матчей в определенном статусе(и менее), в которых команда является организатором
        /// </summary>
        /// <param name="teamId">Айди команды</param>
        /// <param name="teamGameStatus">Статус матча</param>
        /// <returns></returns>
        public List<TeamGame> GetMatchesByCreatorTeam(int teamId, int teamGameStatus)
        {
            return GetItems().Where(tg => tg.FkFirstTeamId == teamId
                                       && tg.Status <= teamGameStatus)
                             .ToList();
        }

        /// <summary>
        /// Возвращает список командных матчей в определенном статусе(и менее), в которых команда является участницей
        /// </summary>
        /// <param name="teamId">Айди команды</param>
        /// <param name="teamGameStatus">Статус матча</param>
        /// <returns></returns>
        public List<TeamGame> GetMatchesByParticipantTeam(int teamId, int teamGameStatus)
        {
            return GetItems().Where(tg => tg.FkSecondTeamId == teamId
                                       && tg.Status <= teamGameStatus)
                             .ToList();
        }

    }
}
