using System.ComponentModel.DataAnnotations.Schema;

namespace FootballMatchManager.DataBase.Models
{
    [Table("GAME")]
    public class Game
    {
        [Column("gameid")]
        public int GameId { get; set; }
        [Column("gamename")]
        public string GameName { get; set; }
        [Column("gameadress")]
        public string GameAdress { get; set; }
        [Column("gamedatetime")]
        public DateTime GameDateTime { get; set; }
        [Column("gamemaxplayers")]
        public int MaxPlayers { get; set; }
        [Column("gamecurrentplayers")]
        public int CurrentPlayers { get; set; }
        [Column("gamestatus")]
        public char GameStatus { get; set; }
        [Column("gameformat")]
        public string GameFormat { get; set; }
        [Column("gamefirstteamgoals")]
        public int FirstTeamGoals { get; set; }
        [Column("gamesecondteamgoals")]
        public int SecondTeamGoals { get; set; }
        [Column("gametype")]
        public string GameType { get; set; }
        [Column("tournamentid")]
        public int TournamentId { get; set; }
        public Tournament Tournament { get; set; }
        public List<ApUserGame> ApUsersGames {get;set;}
        public List<Message> GameMessages { get; set; }
    }
}
