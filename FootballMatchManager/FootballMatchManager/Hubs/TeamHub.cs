using DataBaseManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.IncompleteModels;
using Microsoft.AspNetCore.SignalR;

namespace FootballMatchManager.Hubs
{
    /* Добавить хаб в программ */
    public class TeamHub : Hub
    {
        UnitOfWork _unitOfWork;
        public TeamHub(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task Connect(string teamRecipient)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, teamRecipient);
        }

        public async Task DeleteTeam(int teamId)
        {
            await Clients.Group(Convert.ToString(teamId)).SendAsync("refreshteam");
        }

        public async Task DeleteUserFromTeam(int userID)
        {
            await Clients.User(Convert.ToString(userID))?.SendAsync("refreshteam");
            return;
        }

    }
}
