using DataBaseManager.AppDataBase.Context;
using DataBaseManager.AppDataBase.Models;
using Microsoft.EntityFrameworkCore;

namespace DataBaseManager.AppDataBase.RepositoryPattern
{
    public class ConstantRepository : IRepository<Constant>
    {
        private AppDBContext _dbcontext;

        public ConstantRepository(AppDBContext dbcontext)
        {
            _dbcontext = dbcontext;
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

        // ------------------------------------------------------------------- //

        /// <summary>
        /// Возвращает константу по её наименованию
        /// </summary>
        /// <param name="name">Наименование константы</param>
        /// <returns></returns>
        public Constant GetConstantByName(string name)
        {
            return _dbcontext.Constants.FirstOrDefault(c => c.Name == name);
        }

        /// <summary>
        /// Возвращает список констант определенной группы
        /// </summary>
        /// <param name="group">Нименование группы</param>
        /// <returns></returns>
        public List<Constant> GetConstantsByGroup(string group)
        {
            return _dbcontext.Constants.Where(c => c.Group == group).ToList();
        }
    }
}
