using DataBaseManager.AppDataBase.UnitOfWorkPattern;
using Microsoft.AspNetCore.SignalR;

namespace FootballMatchManager.Hubs
{
    public class DeleteHub : Hub
    {
        UnitOfWork _unitOfWork;

        public DeleteHub(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task DeleteUserFromGame(int userID)
        {
            await Clients.User(Convert.ToString(userID))?.SendAsync("refreshgame");
            return;
        }

        public async Task DeleteUserFromTeam(int userID)
        {
            await Clients.User(Convert.ToString(userID))?.SendAsync("refreshteam");
            return;
        }
    }
}
