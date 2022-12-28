using FootballMatchManager.DataBase.DBClasses;
using FootballMatchManager.DataBase.Models;
using Microsoft.EntityFrameworkCore;

namespace FootballMatchManager.AppDataBase.RepositoryPattern
{
    public class TeamRepository // : IRepository<Team>
    {
        /*
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
        */
    }
}
