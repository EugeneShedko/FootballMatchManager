using FootballMatchManager.AppDataBase.Models;
using FootballMatchManager.DataBase.DBClasses;
using Microsoft.EntityFrameworkCore;

namespace FootballMatchManager.AppDataBase.RepositoryPattern
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
            return _dbcontext.GameEvents.ToList();
        }

        public void UpdateElement(GameEvent item)
        {
            _dbcontext.Entry(item).State = EntityState.Modified;
        }

    }
}
