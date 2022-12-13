using FootballMatchManager.DataBase.DBClasses;
using FootballMatchManager.DataBase.Models;
using Microsoft.EntityFrameworkCore;

namespace FootballMatchManager.AppDataBase.RepositoryPattern
{
    public class NotificationRepository : IRepository<Notification>
    {
        private AppDBContext _dbcontext;

        public NotificationRepository(AppDBContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public void AddElement(Notification item)
        {
            _dbcontext.Notifications.Add(item);
        }

        public void DeleteElement(int firstid, int secondid = 0)
        {
            Notification deleteNotification = _dbcontext.Notifications.Find(firstid);
            if(deleteNotification != null) 
            { 
                _dbcontext.Notifications.Remove(deleteNotification);
            }
        }

        public Notification GetItem(int firstid, int secondid = 0)
        {
            return _dbcontext.Notifications.Find(firstid);
        }

        public IEnumerable<Notification> GetItems()
        {
            return _dbcontext.Notifications.AsNoTracking().ToList();
        }

        public void UpdateElement(Notification item)
        {
            _dbcontext.Entry(item).State= EntityState.Modified;
        }
    }
}
