using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.DataBase.Models;
using Microsoft.AspNetCore.SignalR;

namespace FootballMatchManager.Hubs
{
    public class CommentHub : Hub
    {
                
        public async Task Send(string userName, DateTime commentDate, string commentText, string userResipient, string userSender, string commentId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userResipient);
            await Clients.Group(userResipient).SendAsync("Send", userName, commentDate, commentText, userSender, commentId);
        }
    }
}
