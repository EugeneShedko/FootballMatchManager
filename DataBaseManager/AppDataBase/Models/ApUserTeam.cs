
using System.ComponentModel.DataAnnotations.Schema;

namespace DataBaseManager.AppDataBase.Models
{
    [Table("APUSERTEAM")]
    public class ApUserTeam
    {
        [Column("pkfkteamId")]
        public int PkFkTeamId { get; set; }
        [Column("pkfkuserid")]
        public int PkFkUserId { get; set; }
        [Column("pkusertype")]
        public int PkUserType { get; set; }

        public Team Team { get; set; }
        public ApUser ApUser { get; set; }

        public ApUserTeam() { }

        public ApUserTeam(int teamId, int userId, int userType)
        {
            this.PkFkTeamId= teamId;
            this.PkFkUserId= userId;
            this.PkUserType= userType;
        }
    }
}
