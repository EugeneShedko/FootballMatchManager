using FootballMatchManager.DataBase.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace FootballMatchManager.AppDataBase.Models
{
    [Table("APUSERTEAMGAME")]
    public class ApUserTeamGame
    {

        public int PkFkTeamGameId { get; set; }
        public int PkFkUserId { get; set; }
        public int PkFkUserType { get; set; }

        public TeamGame TeamGame { get; set; }
        public ApUser ApUser { get; set; }

        public ApUserTeamGame() { }

        public ApUserTeamGame(int teamGameId, int userId, int userType)
        {
            this.PkFkTeamGameId = teamGameId;
            this.PkFkUserId = userId;
            this.PkFkUserType= userType;
        }
    }
}
