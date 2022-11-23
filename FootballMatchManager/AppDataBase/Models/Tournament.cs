using System.ComponentModel.DataAnnotations.Schema;

namespace FootballMatchManager.DataBase.Models
{
    [Table("Tournament")]
    public class Tournament
    {
        [Column("tournamentid")]
        public int TournamentId { get; set; }
        [Column("tournamenname")]
        public char TournamentName { get; set; }
        [Column("tournamentstartdate")]
        public DateTime TournamentStartDate { get; set; }
        [Column("tournamentenddate")]
        public DateTime TournamentEndDate { get; set; }
        [Column("teamsnumber")]
        public int TeamsNumber { get; set; }
        [Column("tournamentprizefund")]
        public double TournamentPrizeFund { get; set; }
        [Column("tournamentstatus")]
        public char TournamentStatus { get; set; }
        [Column("usercreator")]
        public int UserCreator { get; set; }

        public ApUser TournamentUserCreator { get; set; }
        public List<TournamentTable> TournamentTable { get; set; } 
        public List<Game> TournamentGames { get; set; }

    }
}
