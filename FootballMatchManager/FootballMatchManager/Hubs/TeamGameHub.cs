using DataBaseManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.IncompleteModels;
using Microsoft.AspNetCore.SignalR;

namespace FootballMatchManager.Hubs
{
    public class TeamGameHub : Hub
    {
        UnitOfWork _unitOfWork;
        public TeamGameHub(UnitOfWork unitOfWork)
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
    }
}
