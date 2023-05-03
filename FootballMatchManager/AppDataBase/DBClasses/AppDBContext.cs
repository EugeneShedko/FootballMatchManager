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

        public AppDBContext(DbContextOptions<AppDBContext> options):base(options) 
        {
            Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Constant>().HasKey(c => c.PkId);
            modelBuilder.Entity<Constant>().HasData(new Constant() { PkId = 1, Group = "notification", Type = "text" ,Name = "addtogame", StrValue = "Пользователь {user} присоединлся к матчу {game}"}, 
                                                    new Constant() { PkId = 2, Group = "notification", Type = "text", Name = "leavefromgame", StrValue = "Пользователь {user} покинул матч {game}"},
                                                    new Constant() { PkId = 3, Group = "notification", Type = "requestforgame", Name = "requestforgame", StrValue = "Пользователь {user} отправил запрос на участие в матче {game}. Разршеить?" },
                                                    new Constant() { PkId = 4, Group = "notification", Type = "text", Name = "dismissreqgame", StrValue = "Пользователь {user} отклонил ваш запрос на участие в матче {game}" },
                                                    new Constant() { PkId = 5, Group = "notification", Type = "text", Name = "acceptreqgame", StrValue = "Пользователь {user} принял ваш запрос на участие в матче {game}" },
                                                    new Constant() { PkId = 6, Group = "notification", Type = "requestforteam", Name = "requestforteam", StrValue = "Пользователь {user} отправил запрос на присоединение к команде {team}. Разршеить?" },
                                                    new Constant() { PkId = 7, Group = "notification", Type = "text", Name = "acceptregteam", StrValue = "Пользователь {user} принял ваш запрос на присоединение к команде {team}" },
                                                    new Constant() { PkId = 8, Group = "notification", Type = "text", Name = "dismissregteam", StrValue = "Пользователь {user} отклонил ваш запрос на присоединение к команде {team}" },
                                                    /* Так себе наименование у данной константы, потом возможно поменять */
                                                    new Constant() { PkId = 9, Group = "notification", Type = "text", Name = "errorreqteam", StrValue = "Невозможно отпарвить запрос на присоединение к команде, так как вы уже являетесь участником 3 команд" },
                                                    new Constant() { PkId = 10, Group = "notification", Type = "text", Name = "teamreqsend", StrValue = "Ваш запрос на присоединение к команде {team} отправлен" },
                                                    new Constant() { PkId = 11, Group = "notification", Type = "requestforteamgame", Name = "requestforteamgame", StrValue = "{team} отправила запрос на присоединение к командному матчу {name}" },
                                                    new Constant() { PkId = 12, Group = "notification", Type = "text", Name = "teamgamereqsend", StrValue = "Ваш запрос на присоединение к матчу отправлен" },
                                                    new Constant() { PkId = 13, Group = "notification", Type = "text", Name = "dismissreqteamgame", StrValue = "Команда {team} отклонила ваш запрос на участие в матче {game}" },
                                                    new Constant() { PkId = 14, Group = "notification", Type = "text", Name = "acceptreqteamgame", StrValue = "Команда {user} принял ваш запрос на участие в матче {game}" },
                                                    new Constant() { PkId = 15, Group = "notification", Type = "text", Name = "leaveteamgame", StrValue = "Команда {team} покинула матч {game}" }

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
            //Плохо сделано, переделать связь многие ко многим
            modelBuilder.Entity<Comment>().HasOne(c => c.Sender).WithMany(apu => apu.CommentSenders).HasForeignKey(c => c.FkSenderId).OnDelete(DeleteBehavior.NoAction); 
            modelBuilder.Entity<Comment>().HasOne(c => c.Recipient).WithMany(apu => apu.CommentsRecipients).HasForeignKey(c => c.FkRecipientId).OnDelete(DeleteBehavior.NoAction); 
            modelBuilder.Entity<ApUserGame>().HasOne(apug => apug.ApUser).WithMany(apu => apu.ApUserGame).HasForeignKey(apug => apug.PkFkUserId).OnDelete(DeleteBehavior.Cascade); 
            modelBuilder.Entity<ApUserGame>().HasOne(apug => apug.Game).WithMany(g => g.ApUsersGames).HasForeignKey(apug => apug.PkFkGameId).OnDelete(DeleteBehavior.Cascade); 
            modelBuilder.Entity<Message>().HasOne(m => m.Sender).WithMany(apu => apu.Messages).HasForeignKey(m => m.FkSenderId).OnDelete(DeleteBehavior.Cascade); 
            modelBuilder.Entity<ApUserTeam>().HasOne(aput => aput.ApUser).WithMany(apu => apu.Teams).HasForeignKey(aput => aput.PkFkUserId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<ApUserTeam>().HasOne(aput => aput.Team).WithMany(t => t.ApUserTeam).HasForeignKey(aput => aput.PkFkTeamId).OnDelete(DeleteBehavior.NoAction);
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
        }
    }
}
