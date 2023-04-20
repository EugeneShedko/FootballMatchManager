using FootballMatchManager.AppDataBase.Models;
using FootballMatchManager.DataBase.DBClasses;
using FootballMatchManager.DataBase.Models;
using FootballMatchManager.Enums;
using Microsoft.EntityFrameworkCore;

namespace FootballMatchManager.AppDataBase.RepositoryPattern
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

        // ------------------------------------------------------------ //

        /* Получаем все матчи, в который пользователь является участником */
        public List<TeamGame> GetPartUserTeamGames(int userId)
        {
            return GetItems2().Where(aputg => aputg.PkFkUserId == userId
                                          && aputg.PkFkUserType == (int)ApUserGameTypeEnum.PARTICIPANT)
                             .Select(aputg => aputg.TeamGame).ToList();
        }

        // ------------------------------------------------------------ //
    }
}
