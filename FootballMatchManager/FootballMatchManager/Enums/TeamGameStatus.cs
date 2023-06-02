namespace FootballMatchManager.Enums
{
    public enum TeamGameStatus
    {
        /* Матч в поиске соперника */
        SEARCH,
        /* Матч с соперником в режиме ожидания начала матча */
        WAIT,
        /* Матч завершен(наступило время начала матча) */
        FINISHED,
        /* Матч завершен организатором матча */
        COMPLETED
    }
}
