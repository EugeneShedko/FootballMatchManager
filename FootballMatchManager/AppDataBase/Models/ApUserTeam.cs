
using System.ComponentModel.DataAnnotations.Schema;

namespace FootballMatchManager.DataBase.Models
{
    [Table("APUSERTEAM")]
    public class ApUserTeam
    {
        [Column("pkfkteamId")]
        public int PkFkTeamId { get; set; }
        [Column("pkfkuserid")]
        public int PkFkUserId { get; set; }
        [Column("pkusertype")]
        public string PkUserType { get; set; }

        public Team Team { get; set; }
        public ApUser ApUser { get; set; }
    }
}
