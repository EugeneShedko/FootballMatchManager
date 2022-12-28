using FootballMatchManager.DataBase.DBClasses;
using FootballMatchManager.DataBase.Models;
using Microsoft.EntityFrameworkCore;

namespace FootballMatchManager.AppDataBase.RepositoryPattern
{
    public class ApUserTeamRepository //: IRepository<ApUserTeam>
    {
        /*
        private AppDBContext _dbcontext;

        public ApUserTeamRepository(AppDBContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public void AddElement(ApUserTeam item)
        {
            _dbcontext.ApUsersTeams.Add(item);
        }

        public void DeleteElement(int firstid, int secondid = 0)
        {
            ApUserTeam deleteapuserteam = _dbcontext.ApUsersTeams.Find(firstid, secondid);
            if(deleteapuserteam != null) 
            { 
                _dbcontext.ApUsersTeams.Remove(deleteapuserteam);
            }
        }

        public void DeleteElement(ApUserTeam deleteapuserteam)
        {
            if (deleteapuserteam != null)
            {
                _dbcontext.ApUsersTeams.Remove(deleteapuserteam);
            }
        }

        public ApUserTeam GetItem(int firstid, int secondid = 0)
        {
            return _dbcontext.ApUsersTeams.Find(firstid, secondid);
        }

        public IEnumerable<ApUserTeam> GetItems()
        {
            return _dbcontext.ApUsersTeams.Include(t => t.ApUser).AsNoTracking().ToList();
        }

        public void UpdateElement(ApUserTeam item)
        {
            _dbcontext.Entry(item).State= EntityState.Modified;
        }
        */
    }
}
