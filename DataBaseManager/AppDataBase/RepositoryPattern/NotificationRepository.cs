using DataBaseManager.AppDataBase.Context;
using DataBaseManager.AppDataBase.Models;
using DataBaseManager.Utilts;
using Microsoft.EntityFrameworkCore;

namespace DataBaseManager.AppDataBase.RepositoryPattern
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

        public Notification GetBaseItem(int firstid)
        {
            return _dbcontext.Notifications.FirstOrDefault(n => n.PkId == firstid);

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

        /// <summary>
        /// Возвращает список уведомлений пользователя
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public List<Notification> GetUserNotification(int userId)
        {
            return _dbcontext.Notifications.Where(n => n.FkRecipient == userId)
                                           .OrderBy(n => n.Status)
                                           .ThenByDescending(n => n.Date)
                                           .ToList();

        }

        /* Здесь не совсем эффективно, так как джойн в одном случае не нужен */
        /// <summary>
        /// Возвращает список записей которым отправлены определенные запросы связанные с определенной сущностью
        /// Но ответ на данный запрос не был получен
        /// </summary>
        /// <param name="entityId"> Идентификатора сущности </param>
        /// <param name="requestType"> Тип запрос </param>
        /// <returns></returns>
        public List<Notification> GetSendRequest(int entityId, string requestType)
        {
            return _dbcontext.Notifications.Include(n => n.Sender)
                                           .Include(n => n.Recipient)
                                           .Where(n => n.EntityId == entityId
                                                    && n.Type == requestType
                                                    && n.Status == (int)NotificationEnum.NotRead)
                                           .ToList();
        }

        /// <summary>
        /// Возвращает количество непрочитанных уведомлений пользователя
        /// </summary>
        /// <param name="userID">Айди пользователя</param>
        /// <returns></returns>
        public int GetUserNotReamNotifiCount(int userID)
        {
            return _dbcontext.Notifications.Where(n => n.FkRecipient == userID
                                                    && n.Status == (int)NotificationEnum.NotRead).Count();  
        }

        /// <summary>
        /// Возвращает список жалоб пользователя
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public List<Notification> GetUserComplains(int userId)
        {
            return _dbcontext.Notifications.Include(n => n.Sender)
                                           .Where(n => n.Type == "complain"
                                                    && n.FkRecipient == userId)
                                           .ToList();
        }

    }
}
