﻿using FootballMatchManager.DataBase.DBClasses;
using FootballMatchManager.DataBase.Models;
using Microsoft.EntityFrameworkCore;

namespace FootballMatchManager.AppDataBase.RepositoryPattern
{
    public class TournamentTableRepository : IRepository<TournamentTable>
    {
        private AppDBContext _dbcontext;

        public TournamentTableRepository(AppDBContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public TournamentTableRepository()
        {
            _dbcontext = new AppDBContext(DBConfigManager.GetDbOptions());
        }
        public void AddElement(TournamentTable item)
        {
            _dbcontext.TournamentsTables.Add(item);
        }

        public void DeleteElement(int firstid, int secondid = 0)
        {
            TournamentTable deleteTournamentTable = _dbcontext.TournamentsTables.Find(firstid, secondid);
            if(deleteTournamentTable != null)
            {
                _dbcontext.TournamentsTables.Remove(deleteTournamentTable);
            }
        }

        public TournamentTable GetItem(int firstid, int secondid = 0)
        {
            return _dbcontext.TournamentsTables.Find(firstid, secondid);
        }

        public IEnumerable<TournamentTable> GetItems()
        {
            return _dbcontext.TournamentsTables.AsNoTracking().ToList();
        }

        public void UpdateElement(TournamentTable item)
        {
            _dbcontext.Entry(item).State = EntityState.Modified;
        }
    }
}