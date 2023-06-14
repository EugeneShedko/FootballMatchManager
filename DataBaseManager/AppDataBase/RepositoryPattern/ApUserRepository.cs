using DataBaseManager.AppDataBase.Context;
using DataBaseManager.AppDataBase.Models;
using DataBaseManager.Utilts;
using Microsoft.EntityFrameworkCore;

namespace DataBaseManager.AppDataBase.RepositoryPattern
{
    public class ApUserRepository : IRepository<ApUser>
    {
        private AppDBContext _dbcontext;

        public ApUserRepository(AppDBContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public void AddElement(ApUser item)
        {
            _dbcontext.ApUsers.Add(item);
        }

        public void DeleteElement(int firstid, int secondid = 0)
        {
            ApUser deleteApUser = _dbcontext.ApUsers.Find(firstid);
            if(deleteApUser != null) 
            { 
                _dbcontext.ApUsers.Remove(deleteApUser);
            }
        }

        public ApUser GetItem(int firstid, int secondid = 0)
        {
            return _dbcontext.ApUsers.Find(firstid);
        }

        public IEnumerable<ApUser> GetItems()
        {
            return _dbcontext.ApUsers.ToList();
        }

        public void UpdateElement(ApUser item)
        {
            _dbcontext.Entry(item).State= EntityState.Modified;
        }
        
        /// <summary>
        /// Возвращает список пользователей(для пользователя)
        /// </summary>
        /// <returns></returns>
        public List<ApUser> GetAllUsers()
        {
            List<ApUser> users = _dbcontext.ApUsers.Where(apu => apu.Status == ApUserGameType.UserStatusActive).ToList();
            users.RemoveAll(apu => apu.Role == "system");
            return users;
        }

        /// <summary>
        /// Возвращает список пользователей в определенном статусе
        /// </summary>
        /// <param name="status">Статус пользователя</param>
        /// <returns></returns>
        public List<ApUser> GetUsersByStatus(string status)
        {
            List<ApUser> users = _dbcontext.ApUsers.Where(apu => apu.Status == status).ToList();
            users.RemoveAll(apu => apu.Role == "system");
            return users;
        }

        /// <summary>
        /// Возвращает пользователя по email
        /// </summary>
        /// <param name="email">email пользователя</param>
        /// <returns></returns>
        public ApUser GetUserByEmail(string email)
        {
            return _dbcontext.ApUsers.FirstOrDefault(u => u.Email == email);
        }

        /// <summary>
        /// Возвращает пользователя администратора
        /// </summary>
        /// <returns></returns>
        public ApUser GetAdmin()
        {
            return _dbcontext.ApUsers.FirstOrDefault(u => u.Email == "admin@mail.ru");
        }
    }
}
