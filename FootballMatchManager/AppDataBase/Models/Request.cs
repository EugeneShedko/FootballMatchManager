using System.ComponentModel.DataAnnotations.Schema;

namespace FootballMatchManager.DataBase.Models
{
    [Table("Request")]
    public class Request
    {
        [Column("requestid")]
        public int RequestId { get; set; }
        [Column("requesttype")]
        public string RequestType { get; set; }
        [Column("requestdate")]
        public DateTime RequestDate { get; set; }
        [Column("requestrecipient")]
        public int RequestRecipient {get;set;}
        [Column("requestsender")]
        public int RequetSender { get; set; }

        public ApUser ApUserRecipient { get; set; }
        public ApUser ApUserSender { get; set; }
    }
}
