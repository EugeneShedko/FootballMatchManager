using DataBaseManager.AppDataBase.Context;
using DataBaseManager.AppDataBase.Models;
using DataBaseManager.Utilts;
using Microsoft.EntityFrameworkCore;

namespace DataBaseManager.AppDataBase.RepositoryPattern
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
            List<Team> teams = _dbcontext.Teams.Where(t => t.Status == (int)TeamStatus.ACTIVE)
                                               .ToList();

            teams?.RemoveAll(team => team.PkId == 1);
            return teams;
        }
         
        /// <summary>
        /// Возвращает команду по наименованию команды
        /// </summary>
        /// <param name="name">Наименование команды</param>
        /// <returns></returns>
        public Team GetTeamByName(string name)
        {
            return _dbcontext.Teams.FirstOrDefault(t => t.Name == name
                                                     && t.Status == (int)TeamStatus.ACTIVE);
        }

        /// <summary>
        /// Возвращает список команд у которых количество участников больше определенного значени
        /// </summary>
        /// <param name="playerCount">Количество участников</param>
        /// <returns></returns>
        public List<Team> GetTeamsByPlayerCount(int playerCount)
        {
            return _dbcontext.Teams.Where(t => t.MemberQnt >= playerCount
                                            && t.Status == (int)TeamStatus.ACTIVE)
                                   .ToList();
        }
    }
}
