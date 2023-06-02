
using DataBaseManager.AppDataBase.Models;

namespace FootballMatchManager.IncompleteModels
{
    public class ShortComment
    {
        public int PkId { get; set; } 
        public string UserName { get; set; }
        public DateTime Date { get; set; }
        public string Text { get; set; }
        public string Image { get; set; }
        public int SenderId { get; set; }

        public ShortComment(){}

        public ShortComment(Comment comment)
        {
            this.PkId     = comment.PkId;
            this.UserName = comment.Sender.FirstName + ' ' + comment.Sender.LastName;
            this.Date     = comment.Date;
            this.Text     = comment.Text;
            this.Image    = comment.Sender.Image;
            this.SenderId = comment.FkSenderId;
        }

    }
}
