using DataBaseManager.AppDataBase.Models;
using DataBaseManager.AppDataBase.UnitOfWorkPattern;
using FootballMatchManager.IncompleteModels;
using FootballMatchManager.Utilts;
using Microsoft.AspNetCore.SignalR;

namespace FootballMatchManager.Hubs
{
    public class CommentHub : Hub
    {
        UnitOfWork _unitOfWork;

        public CommentHub(UnitOfWork unitOfWork, JwtService jwtService)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task Connect(string userRecipient)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userRecipient);
        }

        public async Task Send(string text, int recipientId)
        {
            try
            {
                if (Context.User == null) { return; }

                int userIdSender = int.Parse(Context.User.Identity.Name);

                /* Проверка, существует ли пользователь, в профиле которого мы хотим оставить комментарий */
                ApUser recipientUser = _unitOfWork.ApUserRepository.GetItem(recipientId);
                if (recipientUser == null) { return;}

                /* Попробовать отправить комментарий на стороун пользователя без создания  */
                /* Маленького класса */
                
                /* Создание нового комментария */
                Comment comment = new Comment(text, userIdSender, recipientUser.PkId);
                _unitOfWork.CommentRepository.AddElement(comment);
                _unitOfWork.Save();

                /*В репозитории добавить загрузку связанных данных*/
                Comment loadComment = _unitOfWork.CommentRepository.GetItem(comment.PkId);
                ShortComment shortComment = new ShortComment(loadComment);

                await Clients.Group(Convert.ToString(recipientId)).SendAsync("displayComment", shortComment);

            }
            catch (Exception ex)
            {
                return;
            }
        }

        /*
        public async Task Send(string userName, DateTime commentDate, string commentText, string userRecipient, string userSender, string commentId)
        {
            string imagePath = _unitOfWork.ApUserRepository.GetItem(int.Parse(userSender)).Image;
            await Clients.Group(userRecipient).SendAsync("Send", userName, commentDate, commentText, userSender, commentId, imagePath);
        }
        */

        public async Task UpdateComments(string userRecipient)
        {
            await Clients.Group(userRecipient).SendAsync("UpdateComments");
        }
    }
}
