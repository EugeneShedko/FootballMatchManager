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
        public string? Description { get; set; }
        [Column("Image")]
        public string? Image { get; set; }
   
        public List<ApUserTeam> ApUserTeam { get; set; }
        public List<TournamentTable> TeamTournamentTable { get; set; }

        public Team() { }

        public Team(string name, string desc)
        {
            this.Name = name;
            this.CrtDate = DateTime.Now;
            this.Description = desc;
            this.Image = "teams/default-team-logo.png";
        }

    }
}
