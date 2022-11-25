using FootballMatchManager.DataBase.DBClasses;
using FootballMatchManager.DataBase.Models;
using Microsoft.EntityFrameworkCore;

namespace FootballMatchManager.AppDataBase.RepositoryPattern
{
    public class MessageRepository : IRepository<Message>
    {
        private AppDBContext _dbcontext;

        public MessageRepository(AppDBContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public MessageRepository()
        {
            _dbcontext = new AppDBContext(DBConfigManager.GetDbOptions());
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
            return _dbcontext.Messages.Find(firstid);
        }

        public IEnumerable<Message> GetItems()
        {
            return _dbcontext.Messages.AsNoTracking().ToList();
        }

        public void UpdateElement(Message item)
        {
            _dbcontext.Entry(item).State = EntityState.Modified;
        }
    }
}
