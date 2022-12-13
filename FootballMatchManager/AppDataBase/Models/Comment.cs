
using System.ComponentModel.DataAnnotations.Schema;

namespace FootballMatchManager.DataBase.Models
{
    [Table("COMMENT")]
    public class Comment
    {
        [Column("commentid")]
        public int CommentId {get;set;}
        [Column("commenttext")]
        public string CommentText { get; set; }
        [Column("commentdatetime")]
        public DateTime CommentDateTime { get; set; }
        [Column("commentrecipient")]
        public int CommentRecipient { get; set; }
        [Column("commentsender")]
        public int CommentSender { get; set; }

        public ApUser ApUserRecipient { get; set; }
        public ApUser ApUserSender { get; set; }
    }
}
