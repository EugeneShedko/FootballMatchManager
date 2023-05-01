namespace FootballMatchManager.Enums
{
    public enum TeamGameStatus
    {
        /* Скорее всего матч в поиске соперника */
        SEARCH,
        /* Скорее всего матч с соперником в режиме ожидания начала матча */
        WAIT,
        /* Матч завершен(наступило время начала матча) */
        FINISHED,
        /* Матч завершен организатором матча */
        COMPLETED
    }
}
