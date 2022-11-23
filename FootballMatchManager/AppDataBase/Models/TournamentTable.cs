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
        public int GamesNumber { get; set; }
        [Column("gameswin")]
        public int GamesWin { get; set; }
        [Column("gamesdraw")]
        public int GamesDraw { get; set; }
        [Column("gamesloss")]
        public int GamesLoss { get; set; }
        [Column("goalsscored")]
        public int GoalsScored { get; set; }
        [Column("goalsconseded")]
        public int GoalsConseded { get; set; }
        [Column("goalsdifference")]
        public int GoalsDifference { get; set; }
        [Column("points")]
        public int Points { get; set; }

        public Team TournamentTeam { get; set; }
        public Tournament Tournament { get; set; }
    }
}
