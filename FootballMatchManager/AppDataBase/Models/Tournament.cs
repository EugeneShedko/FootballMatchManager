using System.ComponentModel.DataAnnotations.Schema;

namespace FootballMatchManager.DataBase.Models
{
    [Table("TOURNAMENT")]
    public class Tournament
    {
        [Column("pkid")]
        public int PkId { get; set; }
        [Column("name")]
        public string? Name { get; set; }
        [Column("startdate")]
        public DateTime? StartDate { get; set; }
        [Column("enddate")]
        public DateTime? EndDate { get; set; }
        [Column("teamsqnt")]
        public int? TeamsQnt { get; set; }
        [Column("prizefund")]
        public double? PrizeFund { get; set; }
        [Column("status")]
        public string? Status { get; set; }
        [Column("fkcreatorid")]
        public int FkCreatorId { get; set; } = 1;

        public ApUser TournamentCreator { get; set; }
        public List<TournamentTable> TournamentTable { get; set; } 
        public List<Game> TournamentGames { get; set; }

    }
}
