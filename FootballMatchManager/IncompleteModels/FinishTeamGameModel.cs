namespace FootballMatchManager.IncompleteModels
{
    public class FinishTeamGameModel
    {
        public int GameId { get;set; }
        public int FirstTeamGoals { get; set; }
        public int SecondTeamGoals { get; set; }
        public List<ShortGameEvent> GameEvents { get; set; }
    }
}
