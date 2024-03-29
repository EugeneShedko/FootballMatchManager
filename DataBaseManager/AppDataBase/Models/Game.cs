﻿using DataBaseManager.Utilts;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataBaseManager.AppDataBase.Models
{
    [Table("GAME")]
    public class Game
    {
        [Column("pkid")]
        public int PkId { get; set; }
        [Column("name")]
        public string Name { get; set; }
        [Column("adress")]
        public string Adress { get; set; }
        [Column("datetime")]
        public DateTime DateTime { get; set; }
        [Column("maxplayers")]
        public int? MaxPlayers { get; set; }
        [Column("currplayers")]
        public int? CurrPlayers { get; set; } = 0;
        [Column("status")]
        public int Status { get; set; }
        [Column("format")]
        public string Format { get; set; }

        [Column("type")]
        public int Type { get; set; }
        [Column("fktournamentid")]
        public int fkTournamentId { get; set; } = 1;

        public List<ApUserGame> ApUsersGames {get;set;}

        public Game() { }

        public Game(string name, string adress, DateTime date, 
                    int maxPlayers, string format, int type)
        {
            this.Name = name;
            this.Adress = adress;
            this.DateTime = date;
            this.MaxPlayers = maxPlayers;
            this.Format = format;
            this.CurrPlayers = 1;
            this.Type = type;
            this.Status = (int)TeamGameStatus.WAIT;
        }
    }
}
