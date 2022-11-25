using FootballMatchManager.DataBase.DBClasses;
using FootballMatchManager.DataBase.Models;
using Microsoft.EntityFrameworkCore;

namespace FootballMatchManager.AppDataBase.RepositoryPattern
{
    public class RequestRepository : IRepository<Request>
    {
        private AppDBContext _dbcontext;

        public RequestRepository(AppDBContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public RequestRepository()
        {
            _dbcontext = new AppDBContext(DBConfigManager.GetDbOptions());
        }


        public void AddElement(Request item)
        {
            _dbcontext.Requests.Add(item);
        }

        public void DeleteElement(int firstid, int secondid = 0)
        {
            Request deleteRequest = _dbcontext.Requests.Find(firstid);
            if (deleteRequest != null) 
            { 
                _dbcontext.Requests.Remove(deleteRequest);
            }
        }

        public Request GetItem(int firstid, int secondid = 0)
        {
            return _dbcontext.Requests.Find(firstid);
        }

        public IEnumerable<Request> GetItems()
        {
            return _dbcontext.Requests.AsNoTracking().ToList(); 
        }

        public void UpdateElement(Request item)
        {
            _dbcontext.Entry(item).State = EntityState.Modified;
        }
    }
}
