using FootballMatchManager.DataBase.DBClasses;
using FootballMatchManager.DataBase.Models;
using Microsoft.EntityFrameworkCore;

namespace FootballMatchManager.AppDataBase.RepositoryPattern
{
    public class CommentRepository : IRepository<Comment>
    {
        private AppDBContext _dbcontext;

        public CommentRepository(AppDBContext dbcontext)
        {
            _dbcontext = dbcontext;
        }
        public void AddElement(Comment item)
        {
            _dbcontext.Comments.Add(item);
        }

        public void DeleteElement(int firstid, int secondid = 0)
        {
            Comment deletecomment = _dbcontext.Comments.Find(firstid);
            if (deletecomment != null) 
            { 
                _dbcontext.Comments.Remove(deletecomment);
            }
        }

        public Comment GetItem(int firstid, int secondid = 0)
        {
            return _dbcontext.Comments.Find(firstid);
        }

        public IEnumerable<Comment> GetItems()
        {
            return _dbcontext.Comments.AsNoTracking().ToList();
        }

        public void UpdateElement(Comment item)
        {
            _dbcontext.Entry(item).State = EntityState.Modified;
        }
    }
}
