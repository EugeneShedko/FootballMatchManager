using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.Utilts;
using Microsoft.AspNetCore.SignalR;

namespace FootballMatchManager.Hubs
{
    public class MessageHub : Hub
    {
        UnitOfWork _unitOfWork;
        JwtService _jwtService;

        public MessageHub(UnitOfWork unitOfWork, JwtService jwtService)
        {
            _unitOfWork = unitOfWork;
            _jwtService = jwtService;
        }

        public async Task Connect(string gameRecipient)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, gameRecipient);
        }

        public async Task Send(string userName, DateTime commentDate, string messageText, string gameRecipient, string userSender)
        {
            string imagePath = _unitOfWork.ApUserRepository.GetItem(int.Parse(userSender)).UserImage;
            await Clients.Group(gameRecipient).SendAsync("Send", userName, commentDate, messageText, imagePath);
        }
    }
}
