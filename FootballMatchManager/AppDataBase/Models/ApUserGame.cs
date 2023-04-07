using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FootballMatchManager.DataBase.Models
{
    [Table("APUSERGAME")]
    public class ApUserGame
    {
        [Column("pkfkgameid")]
        public int PkFkGameId { get; set; }
        [Column("pkfkuserid")]
        public int PkFkUserId { get; set; }
        [Column("pkusertype")]
        public string PkUserType { get; set; }

        public Game Game { get; set; }
        public ApUser ApUser { get; set; }
    }
}
