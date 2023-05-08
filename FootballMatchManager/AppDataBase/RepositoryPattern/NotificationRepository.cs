using FootballMatchManager.DataBase.DBClasses;
using FootballMatchManager.DataBase.Models;
using FootballMatchManager.Enums;
using Microsoft.EntityFrameworkCore;

namespace FootballMatchManager.AppDataBase.RepositoryPattern
{
    public class NotificationRepository  : IRepository<Notification>
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
            return _dbcontext.Notifications.Include(n => n.Sender)
                                           .Include(n => n.Recipient)
                                           .FirstOrDefault(n => n.PkId == firstid);
        }

        public IEnumerable<Notification> GetItems()
        {
            return _dbcontext.Notifications.Include(n => n.Sender)
                                           .Include(n => n.Recipient)
                                           .ToList();
        }

        public void UpdateElement(Notification item)
        {
            _dbcontext.Entry(item).State= EntityState.Modified;
        }

        // ------------------------------------------------------------ //

        public List<Notification> GetUserNotification(int userId)
        {
            return GetItems().Where(n => n.FkRecipient == userId)
                             .OrderBy(n => n.Status)
                             .ThenByDescending(n => n.Date)
                             .ToList();

        }

        // ------------------------------------------------------------ //

        /// <summary>
        /// Возвращает список записей которым отправлены определенные запросы связанные с определенной сущностью
        /// Но ответ на данный запрос не был получен
        /// </summary>
        /// <param name="entityId"> Идентификатора сущности </param>
        /// <param name="requestType"> Тип запрос </param>
        /// <returns></returns>
        public List<Notification> GetSendRequest(int entityId, string requestType)
        {
            return GetItems().Where(n => n.EntityId == entityId
                                      && n.Type == requestType
                                      && n.Status == (int)NotificationEnum.NotRead)
                             .ToList();
        }

        // ------------------------------------------------------------ //
    }
}
