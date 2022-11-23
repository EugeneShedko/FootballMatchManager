using System.ComponentModel.DataAnnotations.Schema;

namespace FootballMatchManager.DataBase.Models
{
    [Table("TEAM")]
    public class Team
    {
        [Column("teamid")]
        public int Teamid { get; set; }
        [Column("teamname")]
        public char TeamName { get; set; }
        [Column("createdate")]
        public DateTime CreateDate {get;set;}
   
        public List<ApUserTeam> ApUserTeam { get; set; }
        public List<TournamentTable> TeamTournamentTable { get; set; }

    }
}
