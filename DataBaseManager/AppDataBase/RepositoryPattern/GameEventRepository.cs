using DataBaseManager.AppDataBase.Context;
using DataBaseManager.AppDataBase.Models;
using Microsoft.EntityFrameworkCore;

namespace DataBaseManager.AppDataBase.RepositoryPattern
{
    public class GameEventRepository : IRepository<GameEvent>
    {
        private AppDBContext _dbcontext;
        public GameEventRepository(AppDBContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public void AddElement(GameEvent item)
        {
            _dbcontext.GameEvents.Add(item);
        }

        public void DeleteElement(int firstid, int secondid = 0)
        {
            GameEvent deleteEvent = _dbcontext.GameEvents.Find(firstid);
            if (deleteEvent != null)
            {
                _dbcontext.GameEvents.Remove(deleteEvent);
            }
        }

        public GameEvent GetItem(int firstid, int secondid = 0)
        {
            return _dbcontext.GameEvents.FirstOrDefault(get => get.PkId == firstid);
        }

        /* Здесь потом много повключать нужно будет */
        public IEnumerable<GameEvent> GetItems()
        {
            return _dbcontext.GameEvents.Include(ge => ge.GameEventType)
                                        .Include(ge => ge.Player)
                                        .Include(ge => ge.EventTeam)
                                        .Include(ge => ge.Entity1)
                                        .Include(ge => ge.Entity2)
                                        .ToList();
        }

        public void UpdateElement(GameEvent item)
        {
            _dbcontext.Entry(item).State = EntityState.Modified;
        }

        // ---------------------------------------------------------- //

        /* Возвращает события матча по идентификатору матча и типу матча */
        public List<GameEvent> GatGameEventsByGameId(int gameId, string gameType)
        {
            /* Нужна подгрузка данныx */
            return GetItems().Where(ge => ge.GameId == gameId
                                       && ge.GameType == gameType)
                             .ToList();
        }
    }
}
