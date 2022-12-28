using FootballMatchManager.DataBase.DBClasses;
using FootballMatchManager.DataBase.Models;
using Microsoft.EntityFrameworkCore;

namespace FootballMatchManager.AppDataBase.RepositoryPattern
{
    public class TournamentRepository //: IRepository<Tournament>
    {
        /*
        private AppDBContext _dbcontext;

        public TournamentRepository(AppDBContext dbcontext)
        {
            _dbcontext = dbcontext;
        }
        public void AddElement(Tournament item)
        {
            _dbcontext.Tournaments.Add(item);
        }

        public void DeleteElement(int firstid, int secondid = 0)
        {
            Tournament deleteTournament = _dbcontext.Tournaments.Find(firstid);
            if(deleteTournament != null)
            {
                _dbcontext.Tournaments.Remove(deleteTournament);
            }
        }

        public Tournament GetItem(int firstid, int secondid = 0)
        {
            return _dbcontext.Tournaments.Find(firstid);
        }

        public IEnumerable<Tournament> GetItems()
        {
            return _dbcontext.Tournaments.AsNoTracking().ToList();
        }

        public void UpdateElement(Tournament item)
        {
            _dbcontext.Entry(item).State = EntityState.Modified;
        }
        */
    }
}
