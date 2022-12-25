using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.DataBase.Models;
using Microsoft.AspNetCore.SignalR;

namespace FootballMatchManager.Hubs
{
    public class CommentHub : Hub
    {
        public async Task Connect(string userRecipient)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userRecipient);
        }

        public async Task Send(string userName, DateTime commentDate, string commentText, string userRecipient, string userSender, string commentId)
        {
            await Clients.Group(userRecipient).SendAsync("Send", userName, commentDate, commentText, userSender, commentId);
        }

        public async Task UpdateComments(string userRecipient)
        {
            //Может на сервере не вызывается, посмотреть потом
            await Clients.Group(userRecipient).SendAsync("UpdateComments");
        }
    }
}
