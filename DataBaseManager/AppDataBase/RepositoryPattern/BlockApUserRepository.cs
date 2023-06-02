using DataBaseManager.AppDataBase.Context;
using DataBaseManager.AppDataBase.Models;
using Microsoft.EntityFrameworkCore;

namespace DataBaseManager.AppDataBase.RepositoryPattern
{
    public class BlockApUserRepository : IRepository<BlockApUser>
    {
        private AppDBContext _dbcontext;

        public BlockApUserRepository(AppDBContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public void AddElement(BlockApUser item)
        {
            _dbcontext.BlockUsers.Add(item);
        }

        public void DeleteElement(int firstid, int secondid = 0)
        {
            BlockApUser deleteBlock = _dbcontext.BlockUsers.Find(firstid);
            if (deleteBlock != null)
            {
                _dbcontext.BlockUsers.Remove(deleteBlock);
            }
        }

        public BlockApUser GetItem(int firstid, int secondid = 0)
        {
            return _dbcontext.BlockUsers.Find(firstid);
        }
        public IEnumerable<BlockApUser> GetItems()
        {
            return _dbcontext.BlockUsers.ToList();
        }
        public void UpdateElement(BlockApUser item)
        {
            _dbcontext.Entry(item).State = EntityState.Modified;
        }

        /// <summary>
        /// Возвращает последнюю блокировку пользователя
        /// </summary>
        /// <param name="userId">Айди пользователя</param>
        /// <returns></returns>

        public BlockApUser GetUserBlock(int userId)
        {
            return GetItems().Where(bu => bu.ApUserId == userId).Last();
        }
        /// <summary>
        /// Возвращает все блокировки пользователя
        /// </summary>
        /// <param name="userId">Айди пользователя</param>
        /// <returns></returns>
        public List<BlockApUser> GetUserBlocks(int userId)
        {
            return GetItems().Where(bu => bu.ApUserId == userId).ToList();
        }

    }
}
