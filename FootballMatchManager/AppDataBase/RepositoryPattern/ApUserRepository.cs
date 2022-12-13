using FootballMatchManager.DataBase.DBClasses;
using FootballMatchManager.DataBase.Models;
using Microsoft.EntityFrameworkCore;

namespace FootballMatchManager.AppDataBase.RepositoryPattern
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
            return _dbcontext.ApUsers.AsNoTracking().ToList();
        }

        public void UpdateElement(ApUser item)
        {
            _dbcontext.Entry(item).State= EntityState.Modified;
        }
    }
}
