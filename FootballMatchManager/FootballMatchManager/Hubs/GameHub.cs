using DataBaseManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.IncompleteModels;
using Microsoft.AspNetCore.SignalR;

namespace FootballMatchManager.Hubs
{
    public class GameHub : Hub
    {
        UnitOfWork _unitOfWork;
        public GameHub(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task Connect(string gameRecipient)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, gameRecipient);
        }

        public async Task DeleteGame(int gameId)
        {
            await Clients.Group(Convert.ToString(gameId)).SendAsync("deleteGame");
        }

        public async Task DeleteUserFromGame(int userID)
        {
            await Clients.User(Convert.ToString(userID))?.SendAsync("refreshgame");
            return;
        }
    }
}
