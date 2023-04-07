using FootballMatchManager.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace FootballMatchManager.DataBase.Models
{
    [Table("NOTIFICATION")]
    public class Notification
    {
        [Column("PkId")]
        public int PkId { get; set; }
        [Column("date")]
        public DateTime Date { get; set; }
        [Column("text")]
        public string Text { get; set; }
        [Column("status")]
        public int Status { get; set; }
        [Column("type")]
        public string? Type { get; set; }
        [Column("fkrecipientid")]
        public int FkRecipient { get; set; }
        [Column("fksenderid")]
        public int FkSenderId { get; set; }
        [Column]
        public int? EntityId { get; set; }

        public ApUser Recipient { get; set; }
        public ApUser Sender { get; set; }

        public Notification() { }
        /* Плохо, что здесь задается константой */
        public Notification(int userReceiveId, string type, string text, int entityId,int userSenderId = 1)
        {
            this.Date   = DateTime.Now;
            this.Status = (int)NotificationEnum.NotRead;
            this.Text = text;
            this.Type = type;
            this.FkRecipient = userReceiveId;
            this.FkSenderId = userSenderId;
            this.EntityId = entityId;
        }
    }
}
