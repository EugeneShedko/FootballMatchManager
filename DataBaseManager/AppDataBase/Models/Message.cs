using System.ComponentModel.DataAnnotations.Schema;

namespace DataBaseManager.AppDataBase.Models
{
    [Table("MESSAGE")]
    public class Message
    {
        [Column("pkid")]
        public int PkId       { get; set; }
        [Column("text")]
        public string Text     { get; set; }
        [Column("datetime")]
        public DateTime DateTime { get; set; }
        [Column("fksenderid")]
        public int FkSenderId   { get; set; }
        [Column("entityType")]
        public string EntityType { get; set; }
        [Column("entityId")]
        public int EntityId { get; set; }
        public ApUser Sender { get; set; }

        public Message() { }

        public Message(string text, string entityType, int entityId, int fkSenderId)
        {
            this.Text       = text;
            this.EntityId   = entityId;
            this.FkSenderId = fkSenderId;
            this.DateTime   = DateTime.Now;
            this.EntityType = entityType;
        }
    }
}
