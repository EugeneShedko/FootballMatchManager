using FootballMatchManager.DataBase.Models;

namespace FootballMatchManager.IncompleteModels
{
    public class ShortMessage
    {
        /* Пока что не добавлял айди к сообщению, потому что он не нужн */

        /* Попробовать с типом DateTTime */

        public string UserName { get; set; }
        public DateTime Date { get; set; }
        public string Text {get;set;}
        public string Image { get; set;}
        public int SenderId { get;set; }

        public ShortMessage() { }

        public ShortMessage(Message message)
        {
            this.UserName = message.Sender.FirstName + ' ' + message.Sender.LastName;
            this.Date = message.DateTime;
            this.Text = message.Text;
            this.Image = message.Sender.Image;
            this.SenderId = message.FkSenderId;
        }

    }
}
