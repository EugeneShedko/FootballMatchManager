namespace FootballMatchManager.IncompleteModels
{
    public class ShortTournament
    {
        public string TourName { get; set; }
        public DateTime TourStartDate { get; set; }
        public DateTime TourEndDate { get; set; }
        public int TeamNumbers { get; set; }
        public double TourPrizeFound { get; set; }
        public int UserCreator { get; set; }
    }
}
