using FootballMatchManager.DataBase.DBClasses;
using FootballMatchManager.DataBase.Models;
using Microsoft.EntityFrameworkCore;

namespace FootballMatchManager.AppDataBase.RepositoryPattern
{
    public class ConstantRepository : IRepository<Constant>
    {
        private AppDBContext _dbcontext;

        public ConstantRepository(AppDBContext dbcontext)
        {
            _dbcontext = dbcontext;
        }
        public ConstantRepository()
        {
            _dbcontext = new AppDBContext(DBConfigManager.GetDbOptions());
        }

        public void AddElement(Constant item)
        {
            _dbcontext.Constants.Add(item);
        }

        public void DeleteElement(int firstid, int secondid = 0)
        {
            Constant deleteconstant = _dbcontext.Constants.Find(firstid);
            if (deleteconstant != null) 
            { 
                _dbcontext.Constants.Remove(deleteconstant);
            }
        }

        public Constant GetItem(int firstid, int secondid = 0)
        {
            return _dbcontext.Constants.Find(firstid);
        }

        public IEnumerable<Constant> GetItems()
        {
            return _dbcontext.Constants.AsNoTracking().ToList();
        }

        public void UpdateElement(Constant item)
        {
            _dbcontext.Entry(item).State= EntityState.Modified;
        }
    }
}
