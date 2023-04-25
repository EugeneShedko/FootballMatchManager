using FootballMatchManager.DataBase.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace FootballMatchManager.AppDataBase.Models
{
    [Table("GAMEEVENT")]
    public class GameEvent
    {
        [Column("pkId")]
        public int PkId { get; set; }
        [Column("type")]
        public int FkType { get; set; }
        [Column("time")]
        public int Time { get; set; }
        [Column("playerId")]
        public int? FkPlayerId { get; set; }
        [Column("teamId")]
        public int FkTeamId { get; set; }
        [Column("entityId1")]
        public int? FkEntityId1 { get; set; }
        [Column("entityId2")]
        public int? FkEntityId2 { get; set; }

        public GameEventType GameType { get; set; }
        public ApUser Player { get; set; }
        public Team EventTeam { get; set; }
        public ApUser Entity1 { get;set; }
        public ApUser Entity2 { get;set; }

        public GameEvent(){}
    }
}
