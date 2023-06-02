using DataBaseManager.AppDataBase.Models;
using DataBaseManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.IncompleteModels;
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

        public async Task SendMess(string text, int gameId)
        {
            try
            {
                if (Context.User == null) { return; }

                int userIdSender = int.Parse(Context.User.Identity.Name);

                Message message = new Message(text, "game", gameId, userIdSender);
                _unitOfWork.MessageRepository.AddElement(message);
                _unitOfWork.Save();

                Message loadMessage = _unitOfWork.MessageRepository.GetItem(message.PkId);
                ShortMessage shortMessage = new ShortMessage(loadMessage);

                await Clients.Group(Convert.ToString(gameId)).SendAsync("displayMess", shortMessage);
            }
            catch (Exception ex)
            {
                return;
            }
        }
    }
}
