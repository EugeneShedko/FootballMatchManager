using FootballMatchManager.DataBase.DBClasses;
using FootballMatchManager.DataBase.Models;
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
            return _dbcontext.ApUsersGames.Include(up => up.ApUser).Include(up => up.Game).AsNoTracking().ToList();
        }

        public void UpdateElement(ApUserGame item)
        {
            _dbcontext.Entry(item).State= EntityState.Modified;
        }
    }
}
