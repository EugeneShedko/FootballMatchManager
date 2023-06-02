using DataBaseManager.Utilts;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataBaseManager.AppDataBase.Models
{
    [Table("TeamGame")]
    public class TeamGame
    {
        [Column("pkId")]
        public int PkId { get; set; }
        [Column("Name")]
        public string Name { get; set; }
        [Column("adress")]
        public string Adress { get; set; }
        [Column("datetime")]
        public DateTime DateTime { get; set; }
        [Column("status")]
        public int Status { get; set; }
        [Column("format")]
        public string Format { get; set; }
        [Column("firstteamgoals")]
        public string? FirstTeamGoals { get;set; }
        [Column("secondteamgoals")]
        public string? SecondTeamGoals { get;set; }

        public int FkFirstTeamId { get; set; }
        public int FkSecondTeamId { get; set; }

        public Team FirstTeam { get; set; }
        public Team SecondTeam { get; set; }

        public List<ApUserTeamGame> ApUserTeamGames { get; set; }

        public TeamGame() { }

        public TeamGame(string name, string adress, DateTime date, string format, int firstTeamId)
        {
            this.Name = name;
            this.Adress = adress;
            this.DateTime= date;
            this.Format = format;
            this.FkFirstTeamId = firstTeamId;
            this.FkSecondTeamId = 1;
            this.Status = (int)TeamGameStatus.SEARCH;
        }
    }
}
