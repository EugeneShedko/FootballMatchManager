using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FootballMatchManager.DataBase.Models
{
    [Table("APUSERGAME")]
    public class ApUserGame
    {
        [Column("gameid")]
        public int GameId { get; set; }
        [Column("userid")]
        public int UserId { get; set; }
        [Column("usertype")]
        public char UserType { get; set; }

        public Game Game { get; set; }
        public ApUser ApUser { get; set; }
    }
}
