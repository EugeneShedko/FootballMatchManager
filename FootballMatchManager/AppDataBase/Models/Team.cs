using System.ComponentModel.DataAnnotations.Schema;

namespace FootballMatchManager.DataBase.Models
{
    [Table("TEAM")]
    public class Team
    {
        [Column("pkid")]
        public int PkId { get; set; }
        [Column("name")]
        public string Name { get; set; }
        [Column("crtDate")]
        public DateTime CrtDate {get;set;}
        [Column("description")]
        public string Description { get; set; }
   
        public List<ApUserTeam> ApUserTeam { get; set; }
        public List<TournamentTable> TeamTournamentTable { get; set; }

    }
}
