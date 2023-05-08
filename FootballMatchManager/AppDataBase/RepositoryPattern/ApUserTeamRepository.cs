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

        /* Возвращает участника конкретной команды(скорее всего так) */
        public ApUserTeam GetTeamParticipant(int teamId, int userId)
        {
            return GetItems().FirstOrDefault(aput => aput.PkFkTeamId == teamId
                                                  && aput.PkFkUserId == userId
                                                  && aput.PkUserType == (int)ApUserTeamEnum.PARTICIPANT);
        }

        // ------------------------------------------------------------- //

        /* Возвращает всех участников команды */
        public List<ApUser> GetTeamParticipants(int teamId)
        {
            return GetItems().Where(aput => aput.PkFkTeamId == teamId
                                         && aput.PkUserType == (int)ApUserTeamEnum.PARTICIPANT)
                             .Select(aput => aput.ApUser)
                             .ToList();
        }

        // ------------------------------------------------------------- //

        /* Скорее всего возвращат организатор команды, но не понятно почему не объект ApUser */
        /* Возможно просто проверка на организатора сам объект не нужен(но это не точно) */
        public ApUserTeam GetTeamCreator(int teamId)
        {
            return GetItems().FirstOrDefault(t => t.PkFkTeamId == teamId
                                               && t.PkUserType == (int)ApUserTeamEnum.CREATOR);

        }

        /// <summary>
        /// Возвращает объект ApUser организатора команды
        /// </summary>
        /// <param name="teamId"></param>
        /// <returns></returns>
        public ApUser GetTeamCreatorObj(int teamId)
        {
            return GetItems().Where(t => t.PkFkTeamId == teamId
                                               && t.PkUserType == (int)ApUserTeamEnum.CREATOR)
                             .Select(aput => aput.ApUser)
                             .FirstOrDefault();
        }

        /// <summary>
        /// Возвращает список команд, по списку организаторов команд
        /// </summary>
        /// <param name="creatorsList">Список организаторов команд</param>
        /// <returns></returns>
        public List<Team> GetTeamsByCreators(List<ApUser> creatorsList)
        {
            return GetItems().Where(aput => aput.PkUserType == (int)ApUserTeamEnum.CREATOR
                                         && creatorsList.Any(creator => creator.PkId == aput.PkFkUserId))
                             .Select(aput => aput.Team)
                             .ToList();
        }

        // ------------------------------------------------------------- //

        /* Возвращает запись организатора команды по айдикоманды и айди пользователя */
        public ApUserTeam GetTeamCreator(int teamId, int userId)
        {
            return GetItems().FirstOrDefault(t => t.PkFkTeamId == teamId
                                               && t.PkFkUserId == userId
                                               && t.PkUserType == (int)ApUserTeamEnum.CREATOR);
        }

        // ------------------------------------------------------------- //

        /* Возврашает запись ApUserTeam организтора команды по идентификтору пользователя */
        public ApUserTeam GetTeamCreatorByUserId(int userId)
        {
            return GetItems().FirstOrDefault(aput => aput.PkFkUserId == userId
                                                  && aput.PkUserType == (int)ApUserTeamEnum.CREATOR);
        }

        // ------------------------------------------------------------- //

        /// <summary>
        /// Возвращает объект TEAM(команду) по айди организатора
        /// </summary>
        /// <param name="userId"> Идентификатор организатора команды </param>
        /// <returns></returns>

        public Team GetTeamByCreator(int userId)
        {
            return GetItems().Where(aput => aput.PkFkUserId == userId
                                                  && aput.PkUserType == (int)ApUserTeamEnum.CREATOR)
                             .Select(aput => aput.Team)
                             .FirstOrDefault();

                                       
        }

        // ------------------------------------------------------------- //

        /* Возвращает первую команду, в которой пользователь является участником */
        public Team GetTeamByParticipant(int userId)
        {
            return GetItems().Where(aput => aput.PkFkUserId == userId
                                         && aput.PkUserType == (int)ApUserTeamEnum.PARTICIPANT)
                             .Select(aput => aput.Team)
                             .FirstOrDefault();
                              
        }

        // ------------------------------------------------------------- //

        /* Возвращает команды в которых пользователь является участником */
        public List<Team> GetTeamsByParticipant(int userId)
        {
            return GetItems().Where(aput => aput.PkFkUserId == userId
                                         && aput.PkUserType == (int)ApUserTeamEnum.PARTICIPANT)
                              .Select(aput => aput.Team)
                              .ToList();
        }
    }
}
