using System.ComponentModel.DataAnnotations.Schema;

namespace FootballMatchManager.DataBase.Models
{
    [Table("NOTIFICATION")]
    public class Notification
    {
        [Column("notificationid")]
        public int NotificationId { get; set; }
        [Column("notificationdate")]
        public DateTime NotificationDate { get; set; }
        [Column("notificationstatus")]
        public char NotificationStatus { get; set; }
        [Column("notificationrecipient")]
        public int NotificationRecipient { get; set; }

        public ApUser ApUserRecipient { get; set; }

    }
}
