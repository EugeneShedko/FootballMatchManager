using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.DataBase.Models;
using FootballMatchManager.Utilts;
using Microsoft.AspNetCore.SignalR;

namespace FootballMatchManager.Hubs
{
    public class MessageHub : Hub
    {
        UnitOfWork _unitOfWork;

        public MessageHub(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task Connect(string gameRecipient)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, gameRecipient);
        }

        /*
        public async Task Send(string userName, DateTime commentDate, string messageText, string gameRecipient, string userSender)
        {
            string imagePath = _unitOfWork.ApUserRepository.GetItem(int.Parse(userSender)).Image;
            await Clients.Group(gameRecipient).SendAsync("Send", userName, commentDate, messageText, imagePath);
        }
        */

        public async Task Send(string text, int gameId)
        {
            try
            {
                if (Context.User == null) { return; }

                int userIdSender = int.Parse(Context.User.Identity.Name);

                Message message = new Message(text, gameId, userIdSender);
                _unitOfWork.MessageRepository.AddElement(message);
                _unitOfWork.Save();

                Message loadMessage = _unitOfWork.MessageRepository.GetItem(message.PkId);

                //await Clients.Group(Convert.ToString(gameId)).SendAsync("displayMess", "Метод отработал");
                await Clients.Group(Convert.ToString(gameId)).SendAsync("displayMess", loadMessage);
            }
            catch (Exception ex)
            {
                return;
            }
        }
    }
}
