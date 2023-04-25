using FootballMatchManager.AppDataBase.Models;
using FootballMatchManager.DataBase.DBClasses;
using FootballMatchManager.DataBase.Models;
using Microsoft.EntityFrameworkCore;

namespace FootballMatchManager.AppDataBase.RepositoryPattern
{
    public class GameEventTypeRepository : IRepository<GameEventType>
    {
        private AppDBContext _dbcontext;

        public GameEventTypeRepository(AppDBContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public void AddElement(GameEventType item)
        {
            _dbcontext.GameEventTypes.Add(item);
        }

        public void DeleteElement(int firstid, int secondid = 0)
        {
            GameEventType deleteEventType = _dbcontext.GameEventTypes.Find(firstid);
            if (deleteEventType != null)
            {
                _dbcontext.GameEventTypes.Remove(deleteEventType);
            }
        }

        public GameEventType GetItem(int firstid, int secondid = 0)
        {
            return _dbcontext.GameEventTypes.FirstOrDefault(get => get.PkId == firstid);
        }

        public GameEventType GetItem(string id)
        {
            return _dbcontext.GameEventTypes.FirstOrDefault(get => get.EventTypeId == id);
        }

        public IEnumerable<GameEventType> GetItems()
        {
            return _dbcontext.GameEventTypes.ToList();
        }

        public void UpdateElement(GameEventType item)
        {
            _dbcontext.Entry(item).State = EntityState.Modified;
        }


    }
}
