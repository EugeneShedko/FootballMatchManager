namespace FootballMatchManager.IncompleteModels
{
    public class FinishTeamGameModel
    {
        public int GameId { get;set; }
        public string FirstTeamGoals { get; set; }
        public string SecondTeamGoals { get; set; }
        public List<ShortGameEvent> GameEvents { get; set; }
    }
}
