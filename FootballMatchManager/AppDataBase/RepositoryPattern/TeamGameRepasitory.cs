using FootballMatchManager.AppDataBase.Models;
using FootballMatchManager.DataBase.DBClasses;
using FootballMatchManager.DataBase.Models;
using Microsoft.EntityFrameworkCore;

namespace FootballMatchManager.AppDataBase.RepositoryPattern
{
    public class TeamGameRepasitory
    {
        private AppDBContext _dbcontext;

        public TeamGameRepasitory(AppDBContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public void AddElement(TeamGame item)
        {
            _dbcontext.TeamsGames.Add(item);
        }

        public void DeleteElement(int firstid, int secondid = 0)
        {
            TeamGame deleteGame = _dbcontext.TeamsGames.Find(firstid);
            if (deleteGame != null)
            {
                _dbcontext.TeamsGames.Remove(deleteGame);
            }
        }

        public TeamGame GetItem(int firstid, int secondid = 0)
        {
            return _dbcontext.TeamsGames.Include(t => t.FirstTeam)
                                        .Include(t => t.SecondTeam)
                                        .FirstOrDefault(tg => tg.PkId == firstid);
        }

        public IEnumerable<TeamGame> GetItems()
        {
            return _dbcontext.TeamsGames.Include(t => t.FirstTeam)
                                        .Include(t => t.SecondTeam)
                                        .ToList();
        }

        public void UpdateElement(TeamGame item)
        {
            _dbcontext.Entry(item).State = EntityState.Modified;
        }

        // ---------------------------------------------------------- //

        /* Возвращает список всех командных матчей */
        public List<TeamGame> GetAllTeamGames()
        {
            return GetItems().ToList();
        }

        // ---------------------------------------------------------- //

    }
}
