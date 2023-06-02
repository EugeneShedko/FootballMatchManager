namespace DataBaseManager.Utilts
{
    public static class ApUserGameType
    {
        /* Константы */

        /* Тип пользователя в индивидуальном матче */
        public static string Partisipant = "participant";
        public static string Creator = "creator";
        /* Тип матча в событиях матча */
        public static string EventGameTypePerson = "game";
        public static string EventGameTypeTeam = "teamgame";
        /* Статус пользователя в приложении */
        public static string UserStatusActive  = "active";
        public static string UserStatusBlocked = "block";
        public static string UserStatusDeleted = "delete";
    }
}
