using FootballMatchManager.AppDataBase.Models;
using FootballMatchManager.DataBase.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace FootballMatchManager.DataBase.DBClasses
{
    public class AppDBContext : DbContext
    {
        public DbSet<ApUser> ApUsers { get; set; }
        public DbSet<ApUserGame> ApUsersGames { get; set; } 
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Constant> Constants { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<ApUserTeam> ApUsersTeams { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<TeamGame> TeamsGames { get; set; }
        public DbSet<ApUserTeamGame> ApUserTeamGames { get; set; }
        public DbSet<GameEventType> GameEventTypes { get; set; }
        public DbSet<GameEvent> GameEvents { get; set; }
        public DbSet<BlockApUser> BlockUsers { get; set; }

        public AppDBContext(DbContextOptions<AppDBContext> options):base(options) 
        {
            Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Constant>().HasKey(c => c.PkId);
            modelBuilder.Entity<Constant>().HasData(new Constant() { PkId = 1, Group = "notification", Type = "text" ,Name = "addtogame", StrValue = "Пользователь {user} присоединлся к матчу {game}"}, 
                                                    new Constant() { PkId = 2, Group = "notification", Type = "text", Name = "leavefromgame", StrValue = "Пользователь {user} покинул матч {game}"},
                                                    new Constant() { PkId = 3, Group = "notification", Type = "requestforgame", Name = "requestforgame", StrValue = "Пользователь {user} отправил запрос на участие в матче {game}. Разрешить?" },
                                                    new Constant() { PkId = 4, Group = "notification", Type = "text", Name = "dismissreqgame", StrValue = "Пользователь {user} отклонил ваш запрос на участие в матче {game}" },
                                                    new Constant() { PkId = 5, Group = "notification", Type = "text", Name = "acceptreqgame", StrValue = "Пользователь {user} принял ваш запрос на участие в матче {game}" },
                                                    new Constant() { PkId = 6, Group = "notification", Type = "requestforteam", Name = "requestforteam", StrValue = "Пользователь {user} отправил запрос на присоединение к команде {team}. Разршеить?" },
                                                    new Constant() { PkId = 7, Group = "notification", Type = "text", Name = "acceptregteam", StrValue = "Пользователь {user} принял ваш запрос на присоединение к команде {team}" },
                                                    new Constant() { PkId = 8, Group = "notification", Type = "text", Name = "dismissregteam", StrValue = "Пользователь {user} отклонил ваш запрос на присоединение к команде {team}" },
                                                    new Constant() { PkId = 9, Group = "notification", Type = "text", Name = "errorreqteam", StrValue = "Невозможно отпарвить запрос на присоединение к команде, так как вы уже являетесь участником 3 команд" },
                                                    new Constant() { PkId = 10, Group = "notification", Type = "text", Name = "teamreqsend", StrValue = "Ваш запрос на присоединение к команде {team} отправлен" },
                                                    new Constant() { PkId = 11, Group = "notification", Type = "requestforteamgame", Name = "requestforteamgame", StrValue = "{team} отправила запрос на присоединение к командному матчу {name}" },
                                                    new Constant() { PkId = 12, Group = "notification", Type = "text", Name = "teamgamereqsend", StrValue = "Ваш запрос на присоединение к матчу отправлен" },
                                                    new Constant() { PkId = 13, Group = "notification", Type = "text", Name = "dismissreqteamgame", StrValue = "Команда {team} отклонила ваш запрос на участие в матче {game}" },
                                                    new Constant() { PkId = 14, Group = "notification", Type = "text", Name = "acceptreqteamgame", StrValue = "Команда {user} принял ваш запрос на участие в матче {game}" },
                                                    new Constant() { PkId = 15, Group = "notification", Type = "text", Name = "leaveteamgame", StrValue = "Команда {team} покинула матч {game}" },
                                                    new Constant() { PkId = 16, Group = "notification", Type = "text", Name = "errorinviteteam", StrValue = "Невозможно отправить приглашение на присоединение к команде, так как вы не являетесь организатором команды" },
                                                    new Constant() { PkId = 17, Group = "notification", Type = "requstforinviteteam", Name = "requstforinviteteam", StrValue = "Пользователь {user} приглашает вас присоединиться к команде {team}." },
                                                    new Constant() { PkId = 18, Group = "notification", Type = "text", Name = "teaminvitesend", StrValue = "Ваше приглашение успешно отправлено!" },
                                                    new Constant() { PkId = 19, Group = "notification", Type = "text", Name = "dismissinviteteam", StrValue = "Пользователь {user} отклонил ваше приглашение на присоединение к команде {team}." },
                                                    new Constant() { PkId = 20, Group = "notification", Type = "text", Name = "acceptinviteteam", StrValue = "Пользователь {user} принял ваше приглашение на присоединение к команде {team}." },
                                                    new Constant() { PkId = 21, Group = "notification", Type = "text", Name = "acceptinviteteamsend", StrValue = "Вы присоединились к команде {team}!" },
                                                    new Constant() { PkId = 22, Group = "notification", Type = "requesttoinvitegame", Name = "requesttoinvitegame", StrValue = "Пользователь {user} приглашает вас принять участие в игре {game}" },
                                                    new Constant() { PkId = 23, Group = "notification", Type = "text", Name = "dismissinvitegame", StrValue = "Пользователь {user} отклонил ваше приглашение на присоединение к матчу {game}." },
                                                    new Constant() { PkId = 24, Group = "notification", Type = "text", Name = "acceptinvitegame", StrValue = "Пользователь {user} принял ваше приглашение на присоединение к матчу {game}." },
                                                    new Constant() { PkId = 25, Group = "notification", Type = "text", Name = "acceptinvitegamesend", StrValue = "Вы присоединились к матчу {game}!" },
                                                    new Constant() { PkId = 26, Group = "position",     Type = "text", Name = "forward",         StrValue = "Нападающий" },
                                                    new Constant() { PkId = 27, Group = "position",     Type = "text", Name = "left midfielder", StrValue = "Левый полузащитник" },
                                                    new Constant() { PkId = 28, Group = "position",     Type = "text", Name = "right midfielder", StrValue = "Правый полузащитник" },
                                                    new Constant() { PkId = 29, Group = "position",     Type = "text", Name = "attacking midfielder", StrValue = "Атакующий полузащитник" },
                                                    new Constant() { PkId = 30, Group = "position",     Type = "text", Name = "central midfielder", StrValue = "Центральный полузащитник" },
                                                    new Constant() { PkId = 31, Group = "position",     Type = "text", Name = "holding midfielder", StrValue = "Опорный полузащитник" },
                                                    new Constant() { PkId = 32, Group = "position",     Type = "text", Name = "left defender", StrValue = "Левый защитник" },
                                                    new Constant() { PkId = 33, Group = "position",     Type = "text", Name = "right defender", StrValue = "Правый защитник" },
                                                    new Constant() { PkId = 34, Group = "position",     Type = "text", Name = "central defender", StrValue = "Центральный защитник" },
                                                    new Constant() { PkId = 35, Group = "position",     Type = "text", Name = "Goalkeeper", StrValue = "Вратарь" },
                                                    new Constant() { PkId = 36, Group = "notification", Type = "requesttoinviteteamgame", Name = "requesttoinviteteamgame", StrValue = "Команда {team} приглашает вашу команду принять участие в командном матче {game}" },
                                                    new Constant() { PkId = 37, Group = "notification", Type = "text", Name = "dismissinviteteamgame", StrValue = "Команда {team} отклонил ваше приглашение на присоединение к командному матчу {game}." },
                                                    new Constant() { PkId = 38, Group = "notification", Type = "text", Name = "acceptinviteteamgame", StrValue = "Команда {team} приняла ваше приглашение на присоединение к командному матчу {game}." },
                                                    new Constant() { PkId = 39, Group = "notification", Type = "text", Name = "acceptinviteteamgamesend", StrValue = "Ваша команда присоединилась к матчу {game}!" },
                                                    new Constant() { PkId = 40, Group = "notification", Type = "text", Name = "deleteuserfromgame", StrValue = "Вы были удалены из матча {game} организатором матча" },
                                                    new Constant() { PkId = 41, Group = "notification", Type = "text", Name = "deleteuserfromteam", StrValue = "Вы были удалены из команды {team} организатором команды" },
                                                    new Constant() { PkId = 42, Group = "notification", Type = "text", Name = "deletegame", StrValue = "Матч {game} был удален организатором матча" },
                                                    new Constant() { PkId = 43, Group = "notification", Type = "text", Name = "editgame", StrValue = "В матче {game} была изменена информацию организатором матча" },
                                                    new Constant() { PkId = 44, Group = "notification", Type = "text", Name = "deleteteam", StrValue = "Команда {team} была удалена организатором команды" },
                                                    new Constant() { PkId = 45, Group = "notification", Type = "text", Name = "DeleteUserFromGameAdmin", StrValue = "Вы были удалены из матча {game} администратором приложения" },
                                                    new Constant() { PkId = 46, Group = "notification", Type = "text", Name = "DeleteGameAdmin", StrValue = "Матч {game} был удален администратором приложения" },
                                                    new Constant() { PkId = 47, Group = "notification", Type = "text", Name = "LeavTeamGameAdmin", StrValue = "Команда {team} была удалена из матча {game} администратором приложения" },
                                                    new Constant() { PkId = 48, Group = "notification", Type = "text", Name = "DeleteTeamGameAdmin", StrValue = "Матч {game} был удален администратором приложения" },
                                                    new Constant() { PkId = 49, Group = "notification", Type = "text", Name = "DeleteTeamUserAdmin", StrValue = "Вы были удалены из команды {team} администратором приложения" },
                                                    new Constant() { PkId = 50, Group = "notification", Type = "text", Name = "DeleteTeamAdmin", StrValue = "Команда {team} была удалена администратором приложения" },
                                                    new Constant() { PkId = 51, Group = "notification", Type = "text", Name = "BlockUserTime", StrValue = "Ваш аккаунт заблокирован администратором приложения до {date}. Причина: {reazon}" },                             
                                                    new Constant() { PkId = 52, Group = "notification", Type = "text", Name = "BlockUserForever", StrValue = "Ваш аккаунт навсегда заблокирован администратором приложения. Причина: {reazon}" },
                                                    new Constant() { PkId = 53, Group = "complain", Type = "", Name = "offense", StrValue = "Оскорбление участников" },
                                                    new Constant() { PkId = 54, Group = "complain", Type = "", Name = "spam", StrValue = "Спам" },
                                                    new Constant() { PkId = 55, Group = "complain", Type = "game", Name = "rudeness", StrValue = "Грубость в игре" },
                                                    new Constant() { PkId = 56, Group = "complain", Type = "game", Name = "skipGame", StrValue = "Пропуск матча" },
                                                    new Constant() { PkId = 57, Group = "complain", Type = "game", Name = "organize", StrValue = "Плохая организация матча" },
                                                    new Constant() { PkId = 58, Group = "complain", Type = "another", Name = "another", StrValue = "Другая причина" },
                                                    new Constant() { PkId = 59, Group = "notification", Type = "text", Name = "justComplain", StrValue = "Пользователь {userSender} отправил жалобу на пользователя {complainUser}. Причина: {reason}" },
                                                    new Constant() { PkId = 60, Group = "notification", Type = "text", Name = "gameComplain", StrValue = "Пользователь {userSender} отправил жалобу на пользователя {complainUser}. Причина: {reason} - {game}" },
                                                    new Constant() { PkId = 61, Group = "blockReason", Type = "", Name = "offense", StrValue = "Оскорбление участников" },
                                                    new Constant() { PkId = 62, Group = "blockReason", Type = "", Name = "spam", StrValue = "Спам" },
                                                    new Constant() { PkId = 63, Group = "blockReason", Type = "", Name = "lowActivity", StrValue = "Малая активность" },
                                                    new Constant() { PkId = 64, Group = "blockReason", Type = "", Name = "systematicViolations", StrValue = "Систематические нарушения" },
                                                    new Constant() { PkId = 65, Group = "blockReason", Type = "game", Name = "rudeness", StrValue = "Грубость в игре" },
                                                    new Constant() { PkId = 66, Group = "blockReason", Type = "game", Name = "skipGame", StrValue = "Пропуск матча" },
                                                    new Constant() { PkId = 67, Group = "blockReason", Type = "game", Name = "organize", StrValue = "Плохая организация матча" },
                                                    new Constant() { PkId = 68, Group = "blockReason", Type = "another", Name = "another", StrValue = "Другая причина" }
                                                    );

            modelBuilder.Entity<Comment>().HasKey(c => c.PkId);
            modelBuilder.Entity<ApUser>().HasKey(apu => apu.PkId);
            modelBuilder.Entity<ApUser>().HasData(new ApUser() { PkId = 1, Email = "system", Password = "password", FirstName = "default", Role = "system"},
                                 new ApUser() { PkId = 2, Email = "admin@mail.ru", Password = "nEKhNG4zOncJBLKis3+n0w==", Role = "system" });
            modelBuilder.Entity<ApUserGame>().HasKey(apug => new {apug.PkFkUserId, apug.PkFkGameId, apug.PkUserType});
            modelBuilder.Entity<Message>().HasKey(m => m.PkId);
            modelBuilder.Entity<Game>().HasKey(g => g.PkId);
            modelBuilder.Entity<Notification>().HasKey(n => n.PkId);            
            modelBuilder.Entity<Team>().HasKey(t => t.PkId);
            /* Команда по умолчанию необходима для организации командных матчей*/
            modelBuilder.Entity<Team>().HasData(new Team() { PkId = 1, Name = "", CrtDate = DateTime.Now, Image = "default/question.png" });
            modelBuilder.Entity<ApUserTeam>().HasKey(aput => new { aput.PkFkTeamId, aput.PkFkUserId, aput.PkUserType });
            modelBuilder.Entity<TeamGame>().HasKey(tg => tg.PkId);
            modelBuilder.Entity<ApUserTeamGame>().HasKey(aputg => new {aputg.PkFkUserId, aputg.PkFkTeamGameId, aputg.PkFkUserType});
            modelBuilder.Entity<GameEventType>().HasKey(get => get.PkId);
            /* Вообще тип должен быть уникальным */
            modelBuilder.Entity<GameEventType>().HasData(
                new GameEventType() { PkId = 1, EventTypeId = "goal", Text = "Гол!", Image= "default/event-goal.png" },
                new GameEventType() { PkId = 2, EventTypeId = "yellowcard", Text = "Желтая карточка!", Image = "default/event-card.png" },
                new GameEventType() { PkId = 3, EventTypeId = "redcard", Text = "Красная карточка!", Image = "default/event-card.png" },
                new GameEventType() { PkId = 4, EventTypeId = "change", Text = "Замена!", Image = "default/event-change.png" },
                new GameEventType() { PkId = 5, EventTypeId = "penalty", Text = "Пенальти!", Image = "default/event-penalty.png" },
                new GameEventType() { PkId = 6, EventTypeId = "freekick", Text = "Штрафной удар!", Image = "default/event-free-kick2.png" },
                new GameEventType() { PkId = 7, EventTypeId = "corner", Text = "Углавой удар!", Image = "default/event-corner.png" },
                new GameEventType() { PkId = 8, EventTypeId = "assist", Text = "Голевой пас!", Image = "default/event-assist.png" }
            );

            modelBuilder.Entity<GameEvent>().HasKey(ge => ge.PkId);
            modelBuilder.Entity<BlockApUser>().HasKey(bu => bu.pkId);

            //Плохо сделано, переделать связь многие ко многим
            modelBuilder.Entity<Comment>().HasOne(c => c.Sender).WithMany(apu => apu.CommentSenders).HasForeignKey(c => c.FkSenderId).OnDelete(DeleteBehavior.NoAction); 
            modelBuilder.Entity<Comment>().HasOne(c => c.Recipient).WithMany(apu => apu.CommentsRecipients).HasForeignKey(c => c.FkRecipientId).OnDelete(DeleteBehavior.NoAction); 
            modelBuilder.Entity<ApUserGame>().HasOne(apug => apug.ApUser).WithMany(apu => apu.ApUserGame).HasForeignKey(apug => apug.PkFkUserId).OnDelete(DeleteBehavior.Cascade); 
            modelBuilder.Entity<ApUserGame>().HasOne(apug => apug.Game).WithMany(g => g.ApUsersGames).HasForeignKey(apug => apug.PkFkGameId).OnDelete(DeleteBehavior.Cascade); 
            modelBuilder.Entity<Message>().HasOne(m => m.Sender).WithMany(apu => apu.Messages).HasForeignKey(m => m.FkSenderId).OnDelete(DeleteBehavior.Cascade); 
            modelBuilder.Entity<ApUserTeam>().HasOne(aput => aput.ApUser).WithMany(apu => apu.Teams).HasForeignKey(aput => aput.PkFkUserId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<ApUserTeam>().HasOne(aput => aput.Team).WithMany(t => t.ApUserTeam).HasForeignKey(aput => aput.PkFkTeamId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Notification>().HasOne(n => n.Recipient).WithMany(apu => apu.NotificationsRecipients).HasForeignKey(n => n.FkRecipient).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<Notification>().HasOne(n => n.Sender).WithMany(apu => apu.NotificationsSenders).HasForeignKey(n => n.FkSenderId).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<TeamGame>().HasOne(tg => tg.FirstTeam).WithMany(t => t.FirstTeamsList).HasForeignKey(tg => tg.FkFirstTeamId).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<TeamGame>().HasOne(tg => tg.SecondTeam).WithMany(t => t.SecondTeamList).HasForeignKey(tg => tg.FkSecondTeamId).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<ApUserTeamGame>().HasOne(aput => aput.ApUser).WithMany(apu => apu.ApUserTeamGames).HasForeignKey(aput => aput.PkFkUserId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<ApUserTeamGame>().HasOne(aput => aput.TeamGame).WithMany(tg => tg.ApUserTeamGames).HasForeignKey(aput => aput.PkFkTeamGameId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<GameEvent>().HasOne(ge => ge.GameEventType).WithMany(get => get.GameEvents).HasForeignKey(ge => ge.FkType).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<GameEvent>().HasOne(ge => ge.Player).WithMany(apu => apu.GameEvents).HasForeignKey(ge => ge.FkPlayerId).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<GameEvent>().HasOne(ge => ge.EventTeam).WithMany(t => t.GameEvents).HasForeignKey(ge => ge.FkTeamId).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<GameEvent>().HasOne(ge => ge.Entity1).WithMany(apu => apu.GameEventsEntity1).HasForeignKey(ge => ge.FkEntityId1).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<GameEvent>().HasOne(ge => ge.Entity2).WithMany(apu => apu.GameEventsEntity2).HasForeignKey(ge => ge.FkEntityId2).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<BlockApUser>().HasOne(bu => bu.ApUser).WithMany(apu => apu.ApUserBlocks).HasForeignKey(bu => bu.ApUserId).OnDelete(DeleteBehavior.NoAction);
        }
    }
}
