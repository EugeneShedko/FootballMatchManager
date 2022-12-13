using System.ComponentModel.DataAnnotations.Schema;

namespace FootballMatchManager.DataBase.Models
{
    [Table("MESSAGE")]
    public class Message
    {
        [Column("messageid")]
        public int      MessageId       { get; set; }
        [Column("messagetext")]
        public string MessageText     { get; set; }
        [Column("messagedatetime")]
        public DateTime MessageDateTime { get; set; }
        [Column("gameid")]
        public int      GameId          { get; set; }
        [Column("messagesender")]
        public int     MessageSender   { get; set; }

        public ApUser ApUserSender { get; set; }
        public Game   MessageGame { get; set; }

    }
}
