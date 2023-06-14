using DataBaseManager.AppDataBase.Context;
using DataBaseManager.AppDataBase.Models;
using DataBaseManager.Utilts;
using Microsoft.EntityFrameworkCore;

namespace DataBaseManager.AppDataBase.RepositoryPattern
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

        /// <summary>
        /// Возвращает запись участника команды
        /// </summary>
        /// <param name="teamId">Айди команды</param>
        /// <param name="userId">Айди пользователя</param>
        /// <returns></returns>
        public ApUserTeam GetTeamParticipant(int teamId, int userId)
        {
            return _dbcontext.ApUsersTeams.FirstOrDefault(aput => aput.PkFkTeamId == teamId
                                                               && aput.PkFkUserId == userId
                                                               && aput.PkUserType == (int)ApUserTeamEnum.PARTICIPANT);
        }

        // ------------------------------------------------------------- //

        /// <summary>
        /// Возвращает список участников команды
        /// </summary>
        /// <param name="teamId">Айди команды</param>
        /// <returns></returns>

        public List<ApUser> GetTeamParticipants(int teamId)
        {

            return _dbcontext.ApUsersTeams.Where(aput => aput.PkFkTeamId == teamId
                                                      && aput.PkUserType == (int)ApUserTeamEnum.PARTICIPANT)
                                          .Select(aput => aput.ApUser)
                                          .ToList();
        }

        // ------------------------------------------------------------- //

        /* Скорее всего возвращат организатор команды, но не понятно почему не объект ApUser */
        /* Возможно просто проверка на организатора сам объект не нужен(но это не точно) */
        public ApUserTeam GetTeamCreator(int teamId)
        {
            return _dbcontext.ApUsersTeams.FirstOrDefault(t => t.PkFkTeamId == teamId
                                               && t.PkUserType == (int)ApUserTeamEnum.CREATOR);

        }

        public ApUserTeam GetTeamCreatorWithTeam(int teamId)
        {
            return _dbcontext.ApUsersTeams.Include(t => t.Team)
                                          .FirstOrDefault(t => t.PkFkTeamId == teamId
                                                            && t.PkUserType == (int)ApUserTeamEnum.CREATOR);

        }

        /// <summary>
        /// Возвращает объект ApUser организатора команды
        /// </summary>
        /// <param name="teamId"></param>
        /// <returns></returns>
        public ApUser GetTeamCreatorObj(int teamId)
        {
            return _dbcontext.ApUsersTeams.Where(t => t.PkFkTeamId == teamId
                                               && t.PkUserType == (int)ApUserTeamEnum.CREATOR)
                             .Select(aput => aput.ApUser)
                             .FirstOrDefault();
        }

        /* Остановился в этом месте */
        /// <summary>
        /// Возвращает список команд, по списку организаторов команд
        /// </summary>
        /// <param name="creatorsList">Список организаторов команд</param>
        /// <returns></returns>
        public List<Team> GetTeamsByCreators(List<ApUser> creatorsList)
        {
            return _dbcontext.ApUsersTeams.Include(t => t.Team)
                                          .Where(aput => aput.PkUserType == (int)ApUserTeamEnum.CREATOR
                                                      && aput.Team.Status == (int)TeamStatus.ACTIVE)
                                          .AsEnumerable()
                                          .Where(aput => creatorsList.Any(creator => creator.PkId == aput.PkFkUserId))
                                          .Select(aput => aput.Team)
                                          .ToList();
        }

        // ------------------------------------------------------------- //

        /// <summary>
        /// Возвращает запись организатора команды
        /// </summary>
        /// <param name="teamId">Айди команды</param>
        /// <param name="userId">Айди пользователя</param>
        /// <returns></returns>
        public ApUserTeam GetTeamCreator(int teamId, int userId)
        {
            return _dbcontext.ApUsersTeams.FirstOrDefault(t => t.PkFkTeamId == teamId
                                                            && t.PkFkUserId == userId
                                                            && t.PkUserType == (int)ApUserTeamEnum.CREATOR);
        }

        // ------------------------------------------------------------- //

        /// <summary>
        /// Возвращает объект TEAM(команду) по айди организатора
        /// </summary>
        /// <param name="userId"> Идентификатор организатора команды </param>
        /// <returns></returns>

        public Team GetTeamByCreator(int userId)
        {

            return _dbcontext.ApUsersTeams.Where(aput => aput.PkFkUserId == userId
                                                  && aput.PkUserType == (int)ApUserTeamEnum.CREATOR
                                                  && aput.Team.Status == (int)TeamStatus.ACTIVE)
                             .Select(aput => aput.Team)
                             .FirstOrDefault();
        }

        // ------------------------------------------------------------- //

        /// <summary>
        /// Возвращает первую команду, в которой пользователь является участником
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public Team GetTeamByParticipant(int userId)
        {
            return _dbcontext.ApUsersTeams.Where(aput => aput.PkFkUserId == userId
                                         && aput.PkUserType == (int)ApUserTeamEnum.PARTICIPANT
                                         && aput.Team.Status == (int)TeamStatus.ACTIVE)
                             .Select(aput => aput.Team)
                             .FirstOrDefault();
        }

        // ------------------------------------------------------------- //

        /// <summary>
        /// Возвращает список команд, в которых пользователь явялется участниоком
        /// </summary>
        /// <param name="userId">Айди пользователя</param>
        /// <returns></returns>
        public List<Team> GetTeamsByParticipant(int userId)
        {

            return _dbcontext.ApUsersTeams.Where(aput => aput.PkFkUserId == userId
                                         && aput.PkUserType == (int)ApUserTeamEnum.PARTICIPANT
                                         && aput.Team.Status == (int)TeamStatus.ACTIVE)
                              .Select(aput => aput.Team)
                              .ToList();
        }
    }
}
