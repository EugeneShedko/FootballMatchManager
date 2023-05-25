using FootballMatchManager.DataBase.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace FootballMatchManager.AppDataBase.Models
{
    [Table("BlockApUser")]
    public class BlockApUser
    {
        [Column("pkId")]
        public int pkId { get; set; }
        [Column("BlockingDate")]
        public DateTime BlockingDate { get; set; }
        [Column("EndBlockingDate")]
        public DateTime? EndBlockingDate { get; set; }
        [Column("Reason")]
        public string Reason { get; set; }
        [Column("Message")]
        /* ЭТО ПОЛЕ НЕ ДОЛЖНО БЫТЬ ОБЯЗАТЕЛЬНЫМ */
        public string Message { get; set; }

        [Column("FkUserId")]
        public int ApUserId { get; set; }

        public ApUser ApUser { get; set; }
        public BlockApUser(){}
        public BlockApUser(DateTime? endBlockDate, string reason, int blockUserId, string message = null)
        {
            this.BlockingDate    = DateTime.Now;
            this.EndBlockingDate = endBlockDate;
            this.Reason          = reason;
            this.ApUserId        = blockUserId;
            this.Message         = message;
        }
    }
}
