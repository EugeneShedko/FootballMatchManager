using System.ComponentModel.DataAnnotations.Schema;

namespace FootballMatchManager.DataBase.Models
{
    [Table("TOURNAMENTTABLE")]
    public class TournamentTable
    {
        [Column("tournamentid")]
        public int TournamentId { get; set; }
        [Column("teamid")]
        public int TeamId { get; set; }
        [Column("gamesnumber")]
        public int? GamesNumber { get; set; } = 0;
        [Column("gameswin")]
        public int? GamesWin { get; set; } = 0;
        [Column("gamesdraw")]
        public int? GamesDraw { get; set; } = 0;
        [Column("gamesloss")]
        public int? GamesLoss { get; set; } = 0;
        [Column("goalsscored")]
        public int? GoalsScored { get; set; } = 0;
        [Column("goalsconseded")]
        public int? GoalsConseded { get; set; } = 0;
        [Column("goalsdifference")]
        public int? GoalsDifference { get; set; } = 0;
        [Column("points")]
        public int? Points { get; set; } = 0;

        public Team TournamentTeam { get; set; }
        public Tournament Tournament { get; set; }
    }
}
