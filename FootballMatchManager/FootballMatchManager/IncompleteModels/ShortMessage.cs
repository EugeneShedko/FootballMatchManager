
using DataBaseManager.AppDataBase.Models;

namespace FootballMatchManager.IncompleteModels
{
    public class ShortMessage
    {

        public int PkId { get; set; }
        public string UserName { get; set; }
        public DateTime Date { get; set; }
        public string Text {get;set;}
        public string Image { get; set;}
        public int SenderId { get;set; }

        public ShortMessage() { }

        public ShortMessage(Message message)
        {
            this.PkId = message.PkId;
            this.UserName = message.Sender.FirstName + ' ' + message.Sender.LastName;
            this.Date = message.DateTime;
            this.Text = message.Text;
            this.Image = message.Sender.Image;
            this.SenderId = message.FkSenderId;
        }

    }
}
