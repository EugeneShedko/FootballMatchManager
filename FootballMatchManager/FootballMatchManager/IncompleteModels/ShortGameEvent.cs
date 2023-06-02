namespace FootballMatchManager.IncompleteModels
{
    public class ShortGameEvent
    {
        public int EntityId1 { get; set; }
        public int EntityId2 { get; set; }
        public int PlayerId { get; set;}
        public int TeamId { get; set; }
        public string Time { get; set; }
        public string Type { get; set; }
    }
}
