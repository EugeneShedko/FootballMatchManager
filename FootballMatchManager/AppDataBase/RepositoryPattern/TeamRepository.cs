using FootballMatchManager.DataBase.DBClasses;
using FootballMatchManager.DataBase.Models;
using FootballMatchManager.Enums;
using Microsoft.EntityFrameworkCore;

namespace FootballMatchManager.AppDataBase.RepositoryPattern
{
    public class TeamRepository : IRepository<Team>
    {
        private AppDBContext _dbcontext;
        
        public TeamRepository(AppDBContext dBContext)
        {
            _dbcontext = dBContext;
        }

        public void AddElement(Team item)
        {
            _dbcontext.Teams.Add(item);
        }

        public void DeleteElement(int firstid, int secondid = 0)
        {
            Team deleteTeam = _dbcontext.Teams.Find(firstid);
            if(deleteTeam != null) 
            { 
                _dbcontext.Teams.Remove(deleteTeam);
            }
        }

        public Team GetItem(int firstid, int secondid = 0)
        {
            return _dbcontext.Teams.Find(firstid);
        }

        public IEnumerable<Team> GetItems()
        {
            return _dbcontext.Teams.AsNoTracking().ToList();
        }

        public void UpdateElement(Team item)
        {
            _dbcontext.Entry(item).State = EntityState.Modified;
        }

        // --------------------------------------------------------------- //

        /// <summary>
        /// Возвращает список всех команд
        /// </summary>
        /// <returns></returns>
        public List<Team> GetAllTeams()
        {
            List<Team> teams = GetItems().Where(t => t.Status == (int)TeamStatus.ACTIVE).ToList();
            /* Очень хреново, что здесь удаляю по айди, пока что так */
            teams?.RemoveAll(team => team.PkId == 1);
            return teams;
        }
         
        // -------------------------------------------------------------- //

        public Team GetTeamByName(string name)
        {
            return GetItems().FirstOrDefault(t => t.Name == name
                                               && t.Status == (int)TeamStatus.ACTIVE);
        }

        // -------------------------------------------------------------- //

        /// <summary>
        /// Возвращает список команд у которых количество участников больше определенного значени
        /// </summary>
        /// <param name="playerCount">Количество участников</param>
        /// <returns></returns>
        public List<Team> GetTeamsByPlayerCount(int playerCount)
        {
            return GetItems().Where(t => t.MemberQnt >= playerCount
                                      && t.Status == (int)TeamStatus.ACTIVE)
                             .ToList();
        }
    }
}
