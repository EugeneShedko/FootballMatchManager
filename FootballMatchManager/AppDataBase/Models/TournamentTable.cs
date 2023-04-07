using System.ComponentModel.DataAnnotations.Schema;

namespace FootballMatchManager.DataBase.Models
{
    [Table("TOURNAMENTTABLE")]
    public class TournamentTable
    {
        [Column("pktournamentid")]
        public int PkTournamentId { get; set; }
        [Column("pkteamid")]
        public int PkTeamId { get; set; }
        [Column("gamesqnt")]
        public int? GamesQnt { get; set; } = 0;
        [Column("gameswinqnt")]
        public int? GamesWinQnt { get; set; } = 0;
        [Column("gamesdrawqnt")]
        public int? GamesDrawQnt { get; set; } = 0;
        [Column("gameslossqnt")]
        public int? GamesLossQnt { get; set; } = 0;
        [Column("goalsscoredqnt")]
        public int? GoalsScoredQnt { get; set; } = 0;
        [Column("goalsconsededqnt")]
        public int? GoalsConsededQnt { get; set; } = 0;
        [Column("goalsdiff")]
        public int? GoalsDiff { get; set; } = 0;
        [Column("pointsqnt")]
        public int? PointsQnt { get; set; } = 0;

        public Team TournamentTeam { get; set; }
        public Tournament Tournament { get; set; }
    }
}
