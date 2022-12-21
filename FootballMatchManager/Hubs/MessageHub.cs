using Microsoft.AspNetCore.SignalR;

namespace FootballMatchManager.Hubs
{
    public class MessageHub : Hub
    {
        public async Task Send(string userName, DateTime commentDate, string messageText, string gameRecipient)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, gameRecipient);
            await Clients.Group(gameRecipient).SendAsync("Send", userName, commentDate, messageText);
        }
    }
}
