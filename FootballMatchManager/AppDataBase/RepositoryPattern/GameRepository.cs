using FootballMatchManager.DataBase.DBClasses;
using FootballMatchManager.DataBase.Models;
using Microsoft.EntityFrameworkCore;

namespace FootballMatchManager.AppDataBase.RepositoryPattern
{
    public class GameRepository : IRepository<Game>
    {
        private AppDBContext _dbcontext;

        public GameRepository(AppDBContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public GameRepository()
        {
            _dbcontext = new AppDBContext(DBConfigManager.GetDbOptions());
        }

        public void AddElement(Game item)
        {
            _dbcontext.Games.Add(item);
        }

        public void DeleteElement(int firstid, int secondid = 0)
        {
            Game deleteGame = _dbcontext.Games.Find(firstid);
            if (deleteGame != null) 
            { 
                _dbcontext.Games.Remove(deleteGame);
            }
        }

        public Game GetItem(int firstid, int secondid = 0)
        {
            return _dbcontext.Games.Find(firstid);
        }

        public IEnumerable<Game> GetItems()
        {
            return _dbcontext.Games.AsNoTracking().ToList();
        }

        public void UpdateElement(Game item)
        {
            _dbcontext.Entry(item).State= EntityState.Modified;
        }
    }
}
