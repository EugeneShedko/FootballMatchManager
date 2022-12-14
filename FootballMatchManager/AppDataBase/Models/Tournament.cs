using System.ComponentModel.DataAnnotations.Schema;

namespace FootballMatchManager.DataBase.Models
{
    [Table("TOURNAMENT")]
    public class Tournament
    {
        [Column("tournamentid")]
        public int TournamentId { get; set; }
        [Column("tournamenname")]
        public string? TournamentName { get; set; }
        [Column("tournamentstartdate")]
        public DateTime? TournamentStartDate { get; set; }
        [Column("tournamentenddate")]
        public DateTime? TournamentEndDate { get; set; }
        [Column("teamsnumber")]
        public int? TeamsNumber { get; set; }
        [Column("tournamentprizefund")]
        public double? TournamentPrizeFund { get; set; }
        [Column("tournamentstatus")]
        public string? TournamentStatus { get; set; }
        [Column("usercreator")]
        public int UserCreator { get; set; } = 1;

        public ApUser TournamentUserCreator { get; set; }
        public List<TournamentTable> TournamentTable { get; set; } 
        public List<Game> TournamentGames { get; set; }

    }
}
