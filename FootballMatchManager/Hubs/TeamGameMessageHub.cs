using FootballMatchManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.DataBase.Models;
using FootballMatchManager.IncompleteModels;
using Microsoft.AspNetCore.SignalR;

namespace FootballMatchManager.Hubs
{
    public class TeamGameMessageHub : Hub
    {
        UnitOfWork _unitOfWork;

        public TeamGameMessageHub(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task Connect(string teamGameRecipient)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, teamGameRecipient);

        }

        /* Добавить тип сущности, в которую отправляют сообщение */
        public async Task SendMess(string text, int teamGameId)
        {
            try
            {
                if (Context.User == null) { return; }

                int userIdSender = int.Parse(Context.User.Identity.Name);

                /* !!!! Плохо, что константой задаю */
                Message message = new Message(text, "teamgame", teamGameId, userIdSender);
                _unitOfWork.MessageRepository.AddElement(message);
                _unitOfWork.Save();

                Message loadMessage = _unitOfWork.MessageRepository.GetItem(message.PkId);
                ShortMessage shortMessage = new ShortMessage(loadMessage);

                await Clients.Group(Convert.ToString(teamGameId)).SendAsync("displayMess", shortMessage);
            }
            catch (Exception ex)
            {
                return;
            }
        }

    }
}
