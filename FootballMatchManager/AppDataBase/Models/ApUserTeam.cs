
using System.ComponentModel.DataAnnotations.Schema;

namespace FootballMatchManager.DataBase.Models
{
    [Table("APUSERTEAM")]
    public class ApUserTeam
    {
        [Column("teamid")]
        public int TeamId { get; set; }
        [Column("userid")]
        public int UserId { get; set; }
        [Column("usertype")]
        public string UserType { get; set; }

        public Team Team { get; set; }
        public ApUser ApUser { get; set; }
    }
}
