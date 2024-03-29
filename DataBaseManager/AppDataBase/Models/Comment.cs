﻿
using System.ComponentModel.DataAnnotations.Schema;

namespace DataBaseManager.AppDataBase.Models
{
    [Table("COMMENT")]
    public class Comment
    {
        [Column("pkid")]
        public int PkId {get;set;}
        [Column("text")]
        public string Text { get; set; }
        [Column("date")]
        public DateTime Date { get; set; }
        [Column("fkrecipientid")]
        public int FkRecipientId { get; set; }
        [Column("fksenderid")]
        public int FkSenderId { get; set; }

        public ApUser Recipient { get; set; }
        public ApUser Sender { get; set; }

        public Comment() { }

        public Comment(string text, int senderId, int recipientId)
        {
            this.Text = text;
            this.FkSenderId= senderId;
            this.FkRecipientId= recipientId;
            this.Date = DateTime.Now;
        }


    }
}
