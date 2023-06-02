using DataBaseManager.AppDataBase.Context;
using DataBaseManager.AppDataBase.Models;
using DataBaseManager.Utilts;
using Microsoft.EntityFrameworkCore;

namespace DataBaseManager.AppDataBase.RepositoryPattern
{
    public class GameRepository : IRepository<Game>
    {
        private AppDBContext _dbcontext;

        public GameRepository(AppDBContext dbcontext)
        {
            _dbcontext = dbcontext;
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

        // ---------------------------------------------------------- //
        public List<Game> GetAllGamesForUser()
        {
            return GetItems().OrderByDescending(g => g.DateTime)
                             .ToList();
        }
        /// <summary>
        /// Возвращает список матчей в определенном статусе
        /// </summary>
        /// <param name="status">Статус матча</param>
        /// <returns></returns>
        public List<Game> GetGamesByStatus(int status)
        {
            if(status == (int)TeamGameStatus.WAIT)
               return GetItems().Where(g => g.Status == status)
                                .OrderByDescending(g => g.CurrPlayers)
                                .ThenByDescending(g => g.DateTime)
                                .ToList();

            if(status == (int)TeamGameStatus.COMPLETED)
                return GetItems().Where(g => g.Status == status)
                                 .OrderByDescending(g => g.DateTime)
                                 .ToList();


            return GetItems().Where(g => g.Status == status)
                             .OrderByDescending(g => g.DateTime)
                             .ToList();
        }

    }
}
