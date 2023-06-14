using DataBaseManager.AppDataBase.Context;
using DataBaseManager.AppDataBase.Models;
using Microsoft.EntityFrameworkCore;

namespace DataBaseManager.AppDataBase.RepositoryPattern
{
    public class MessageRepository : IRepository<Message>
    {
        private AppDBContext _dbcontext;

        public MessageRepository(AppDBContext dbcontext)
        {
            _dbcontext = dbcontext;
        }
        public void AddElement(Message item)
        {
            _dbcontext.Messages.Add(item);
        }

        public void DeleteElement(int firstid, int secondid = 0)
        {
            Message deleteMessage = _dbcontext.Messages.Find(firstid);
            if (deleteMessage != null)
            {
                _dbcontext.Messages.Remove(deleteMessage);
            }
        }

        public Message GetItem(int firstid, int secondid = 0)
        {
            return _dbcontext.Messages.Include(m => m.Sender)
                                       .FirstOrDefault(m => m.PkId == firstid);
        }

        public IEnumerable<Message> GetItems()
        {
            return _dbcontext.Messages.Include(m => m.Sender)
                                      .ToList();
        }

        public void UpdateElement(Message item)
        {
            _dbcontext.Entry(item).State = EntityState.Modified;
        }

        // --------------------------------------------------------------------------- //
        /// <summary>
        /// Возвращает список сообщений определенной сущности
        /// </summary>
        /// <param name="entityType">Тип сущности</param>
        /// <param name="entityId">Айди сущности</param>
        /// <returns></returns>

        public List<Message> GetEntityMessages(string entityType, int entityId)
        {
            return _dbcontext.Messages.Include(m => m.Sender)
                                      .Where(m => m.EntityType == entityType
                                               && m.EntityId == entityId)
                                      .ToList();
        }
    }
}
