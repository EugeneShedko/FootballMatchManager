namespace FootballMatchManager.IncompleteModels
{
    public class ShortBlockApUser
    {
        public int UserId { get; set; }
        public int BlockPeriod { get; set; }

        public int GameId { get; set; }
        public int ReasonId { get; set; }
        public string GameName { get; set; }
        public string ReasonText { get; set; }
    }
}
