namespace FootballMatchManager.IncompleteModels
{
    public class ShortGame
    {
        public int UserId { get; set; }
        public int GameId { get; set; }
        public string GameName { get; set; }
        public string GameAdress { get; set; }
        public DateTime GameDate { get; set; }

        public string GameFormat { get; set; }
    }
}
