using FootballMatchManager.DataBase.DBClasses;
using FootballMatchManager.DataBase.Models;
using FootballMatchManager.Enums;
using Microsoft.EntityFrameworkCore;

namespace FootballMatchManager.AppDataBase.RepositoryPattern
{
    public class ApUserTeamRepository : IRepository<ApUserTeam>
    {
        private AppDBContext _dbcontext;

        public ApUserTeamRepository(AppDBContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public void AddElement(ApUserTeam item)
        {
            _dbcontext.ApUsersTeams.Add(item);
        }

        public void DeleteElement(int firstid, int secondid = 0)
        {
            ApUserTeam deleteapuserteam = _dbcontext.ApUsersTeams.Find(firstid, secondid);
            if(deleteapuserteam != null) 
            { 
                _dbcontext.ApUsersTeams.Remove(deleteapuserteam);
            }
        }

        public void DeleteElement(ApUserTeam deleteapuserteam)
        {
            if (deleteapuserteam != null)
            {
                _dbcontext.ApUsersTeams.Remove(deleteapuserteam);
            }
        }

        public ApUserTeam GetItem(int firstid, int secondid = 0)
        {
            return _dbcontext.ApUsersTeams.Find(firstid, secondid);
        }

        public IEnumerable<ApUserTeam> GetItems()
        {
            return _dbcontext.ApUsersTeams.Include(t => t.ApUser)
                                          .Include(t => t.Team)
                                          .ToList();
        }

        public void UpdateElement(ApUserTeam item)
        {
            _dbcontext.Entry(item).State= EntityState.Modified;
        }

        // ------------------------------------------------------------- //

        public ApUserTeam GetTeamParticipant(int teamId, int userId)
        {
            return GetItems().FirstOrDefault(aput => aput.PkFkTeamId == teamId
                                                  && aput.PkFkUserId == userId
                                                  && aput.PkUserType == (int)ApUserTeamEnum.PARTICIPANT);
        }

        // ------------------------------------------------------------- //

        public List<ApUser> GetTeamParticipants(int teamId)
        {
            return GetItems().Where(aput => aput.PkFkTeamId == teamId
                                         && aput.PkUserType == (int)ApUserTeamEnum.PARTICIPANT)
                             .Select(aput => aput.ApUser)
                             .ToList();
        }

        // ------------------------------------------------------------- //

        public ApUserTeam GetTeamCreator(int teamId)
        {
            return GetItems().FirstOrDefault(t => t.PkFkTeamId == teamId
                                               && t.PkUserType == (int)ApUserTeamEnum.CREATOR);
        }
    }
}
