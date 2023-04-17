using FootballMatchManager.AppDataBase.Models;
using FootballMatchManager.DataBase.DBClasses;
using FootballMatchManager.DataBase.Models;
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

        public void UpdateElement(ApUserTeamGame item)
        {
            _dbcontext.Entry(item).State = EntityState.Modified;
        }
    }
}
