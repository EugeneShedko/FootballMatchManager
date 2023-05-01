using FootballMatchManager.DataBase.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace FootballMatchManager.AppDataBase.Models
{
    [Table("GAMEEVENT")]
    public class GameEvent
    {
        [Column("pkId")]
        public int PkId { get; set; }
        [Column("gameId")]
        public int GameId { get; set; }
        [Column("type")]
        public int FkType { get; set; }
        [Column("time")]
        public string Time { get; set; }
        [Column("playerId")]
        public int? FkPlayerId { get; set; }
        [Column("teamId")]
        public int FkTeamId { get; set; }
        [Column("entityId1")]
        public int? FkEntityId1 { get; set; }
        [Column("entityId2")]
        public int? FkEntityId2 { get; set; }

        /* Пока что не делать связь на игру, так как */
        /* Может буду добавлять и к персональным матчам */
        public GameEventType GameType { get; set; }
        public ApUser Player { get; set; }
        public Team EventTeam { get; set; }
        public ApUser Entity1 { get;set; }
        public ApUser Entity2 { get;set; }

        public GameEvent(){}

        public GameEvent(int gameId, int typeId, string time, int playerId, int teamId, int entityId1, int entityId2)
        {
            this.GameId = gameId;
            this.FkType = typeId;
            this.Time = time;
            this.FkPlayerId = playerId != -1 ? playerId : null;
            this.FkTeamId = teamId;
            this.FkEntityId1 = entityId1 != -1 ? entityId1 : null;
            this.FkEntityId2 = entityId2 != -1 ? entityId2 : null;
        }
    }
}
