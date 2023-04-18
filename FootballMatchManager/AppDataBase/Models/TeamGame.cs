using FootballMatchManager.DataBase.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace FootballMatchManager.AppDataBase.Models
{
    [Table("TeamGame")]
    public class TeamGame
    {
        [Column("pkId")]
        public int PkId { get; set; }
        [Column("adress")]
        public string Adress { get; set; }
        [Column("datetime")]
        public DateTime DateTime { get; set; }
        [Column("status")]
        public string Status { get; set; } = "active";
        [Column("format")]
        public string Format { get; set; }

        public int FkFirstTeamId { get; set; }
        public int FkSecondTeamId { get; set; }

        public Team FirstTeam { get; set; }
        public Team SecondTeam { get; set; }

        public List<ApUserTeamGame> ApUserTeamGames { get; set; }

        public TeamGame() { }

        public TeamGame(string adress, DateTime date, string format, int firstTeamId)
        {
            this.Adress = adress;
            this.DateTime= date;
            this.Format = format;
            this.FkFirstTeamId = firstTeamId;
            this.FkSecondTeamId = 1;
        }
    }
}
