using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataBaseManager.AppDataBase.Models
{
    [Table("GAMEEVENTTYPE")]
    public class GameEventType
    {
        [Column("pkId")]
        public int PkId { get; set; }
        [Column("eventtype")]
        public string EventTypeId { get; set; }
        [Column("text")]
        public string Text { get; set; }
        [Column("image")]
        public string Image { get; set; }

        public List<GameEvent> GameEvents { get; set; }

        public GameEventType() { }
    }
}
