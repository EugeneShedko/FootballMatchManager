using DataBaseManager.AppDataBase.Models;
using DataBaseManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.IncompleteModels;
using Microsoft.AspNetCore.SignalR;

namespace FootballMatchManager.Hubs
{
    public class TeamMessageHub : Hub
    {
        UnitOfWork _unitOfWork;
        public TeamMessageHub(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task Connect(string teamRecipient)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, teamRecipient);
        }

        /* Добавить тип сущности, в которую отправляют сообщение */
        public async Task SendMess(string text, int teamId)
        {
            try
            {
                if (Context.User == null) { return; }

                int userIdSender = int.Parse(Context.User.Identity.Name);

                /* !!!! Плохо, что константой задаю */
                Message message = new Message(text, "team", teamId, userIdSender);
                _unitOfWork.MessageRepository.AddElement(message);
                _unitOfWork.Save();

                Message loadMessage = _unitOfWork.MessageRepository.GetItem(message.PkId);
                ShortMessage shortMessage = new ShortMessage(loadMessage);

                await Clients.Group(Convert.ToString(teamId)).SendAsync("displayMess", shortMessage);
            }
            catch (Exception ex)
            {
                return;
            }
        }

    }
}
