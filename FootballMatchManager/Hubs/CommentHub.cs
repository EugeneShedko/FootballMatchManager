using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.DataBase.Models;
using FootballMatchManager.Utilts;
using Microsoft.AspNetCore.SignalR;

namespace FootballMatchManager.Hubs
{
    public class CommentHub : Hub
    {
        UnitOfWork _unitOfWork;
        JwtService _jwtService;

        public CommentHub(UnitOfWork unitOfWork, JwtService jwtService)
        {
            _unitOfWork = unitOfWork;
            _jwtService = jwtService;
        }
        public async Task Connect(string userRecipient)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userRecipient);
        }

        public async Task Send(string userName, DateTime commentDate, string commentText, string userRecipient, string userSender, string commentId)
        {
            string imagePath = _unitOfWork.ApUserRepository.GetItem(int.Parse(userSender)).Image;
            await Clients.Group(userRecipient).SendAsync("Send", userName, commentDate, commentText, userSender, commentId, imagePath);
        }

        public async Task UpdateComments(string userRecipient)
        {
            await Clients.Group(userRecipient).SendAsync("UpdateComments");
        }
    }
}
