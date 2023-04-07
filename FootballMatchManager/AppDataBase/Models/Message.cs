﻿using System.ComponentModel.DataAnnotations.Schema;

namespace FootballMatchManager.DataBase.Models
{
    [Table("MESSAGE")]
    public class Message
    {
        [Column("pkid")]
        public int      PkId       { get; set; }
        [Column("text")]
        public string Text     { get; set; }
        [Column("datetime")]
        public DateTime DateTime { get; set; }
        [Column("fkgameId")]
        public int      FkGameId          { get; set; }
        [Column("fksenderid")]
        public int     FkSenderId   { get; set; }

        public ApUser Sender { get; set; }
        public Game   Game { get; set; }

        public Message(string text, int fkGameId, int fkSenderId)
        {
            this.Text = text;
            this.FkGameId = fkGameId;
            this.FkSenderId = fkSenderId;
            this.DateTime= DateTime.Now;   
        }

    }
}
