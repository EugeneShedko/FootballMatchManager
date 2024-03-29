﻿using DataBaseManager.AppDataBase.Context;
using DataBaseManager.AppDataBase.Models;
using Microsoft.EntityFrameworkCore;

namespace DataBaseManager.AppDataBase.RepositoryPattern
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
            return _dbcontext.Comments.Include(c => c.Sender)
                                      .Include(c => c.Recipient)
                                      .FirstOrDefault(c => c.PkId == firstid);
        }

        public IEnumerable<Comment> GetItems()
        {
            return _dbcontext.Comments.Include(c => c.Sender).AsNoTracking().ToList();
        }

        public void UpdateElement(Comment item)
        {
            _dbcontext.Entry(item).State = EntityState.Modified;
        }

        public List<Comment> GetUserComments(int userId)
        {
            return _dbcontext.Comments.Include(c => c.Sender)
                                      .Where(c => c.FkRecipientId == userId)
                                      .ToList();
        }
    }
}
