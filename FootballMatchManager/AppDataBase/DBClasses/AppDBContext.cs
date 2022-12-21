using FootballMatchManager.DataBase.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace FootballMatchManager.DataBase.DBClasses
{
    public class AppDBContext : DbContext
    {
        public DbSet<ApUser> ApUsers { get; set; }
        public DbSet<ApUserGame> ApUsersGames { get; set; }
        public DbSet<ApUserTeam> ApUsersTeams { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Constant> Constants { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Request> Requests { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<Tournament> Tournaments { get; set; }
        public DbSet<TournamentTable> TournamentsTables { get; set; }

        public AppDBContext(DbContextOptions<AppDBContext> options):base(options) 
        {
            Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Constant>().HasKey(c => c.ConstantId);
            modelBuilder.Entity<Request>().HasKey(r => r.RequestId);
            modelBuilder.Entity<Comment>().HasKey(c => c.CommentId);
            modelBuilder.Entity<ApUser>()
                        .HasData(new ApUser() { ApUserId = 1, UserFirstName = "default", UserRole = "system"},
                                 new ApUser() { ApUserId = 2, UserEmail = "ad", UserPassword = "nEKhNG4zOncJBLKis3+n0w==", UserRole = "system" });
            modelBuilder.Entity<Notification>().HasKey(n => n.NotificationId);
            modelBuilder.Entity<Team>().HasKey(t => t.Teamid);
            modelBuilder.Entity<ApUserTeam>().HasKey(aput => new { aput.TeamId, aput.UserId });
            modelBuilder.Entity<Tournament>().HasData(new Tournament() { TournamentId = 1, TournamentName = "default",  });
            modelBuilder.Entity<ApUserGame>().HasKey(apug => new {apug.UserId, apug.GameId, apug.UserType});
            modelBuilder.Entity<Message>().HasKey(m => m.MessageId);
            modelBuilder.Entity<TournamentTable>().HasKey(tt => new { tt.TournamentId, tt.TeamId });
            modelBuilder.Entity<Game>().HasKey(g => g.GameId);

            //Плохо сделано, переделать связь многие ко многим
            modelBuilder.Entity<Request>().HasOne(r => r.ApUserSender).WithMany(apu => apu.UserRequestsSenders).HasForeignKey(r => r.RequetSender).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<Request>().HasOne(r => r.ApUserRecipient).WithMany(apu => apu.UserRequestsRecipients).HasForeignKey(r => r.RequestRecipient).OnDelete(DeleteBehavior.NoAction);
            modelBuilder.Entity<Comment>().HasOne(c => c.ApUserSender).WithMany(apu => apu.UserCommentSenders).HasForeignKey(c => c.CommentSender).OnDelete(DeleteBehavior.NoAction); 
            modelBuilder.Entity<Comment>().HasOne(c => c.ApUserRecipient).WithMany(apu => apu.UserCommentsRecipients).HasForeignKey(c => c.CommentRecipient).OnDelete(DeleteBehavior.NoAction); 
            modelBuilder.Entity<Notification>().HasOne(n => n.ApUserRecipient).WithMany(apu => apu.UserNotifications).HasForeignKey(n => n.NotificationRecipient).OnDelete(DeleteBehavior.NoAction); 
            modelBuilder.Entity<ApUserTeam>().HasOne(aput => aput.ApUser).WithMany(apu => apu.UserTeams).HasForeignKey(aput => aput.UserId).OnDelete(DeleteBehavior.Cascade); 
            modelBuilder.Entity<ApUserTeam>().HasOne(aput => aput.Team).WithMany(t => t.ApUserTeam).HasForeignKey(aput => aput.TeamId).OnDelete(DeleteBehavior.NoAction); 
            modelBuilder.Entity<Tournament>().HasOne(t => t.TournamentUserCreator).WithMany(apu => apu.UserTournaments).HasForeignKey(t => t.UserCreator).OnDelete(DeleteBehavior.NoAction); 
            modelBuilder.Entity<ApUserGame>().HasOne(apug => apug.ApUser).WithMany(apu => apu.ApUserGame).HasForeignKey(apug => apug.UserId).OnDelete(DeleteBehavior.Cascade); 
            modelBuilder.Entity<ApUserGame>().HasOne(apug => apug.Game).WithMany(g => g.ApUsersGames).HasForeignKey(apug => apug.GameId).OnDelete(DeleteBehavior.Cascade); 
            modelBuilder.Entity<Message>().HasOne(m => m.ApUserSender).WithMany(apu => apu.UserMessages).HasForeignKey(m => m.MessageSender).OnDelete(DeleteBehavior.Cascade); 
            modelBuilder.Entity<Message>().HasOne(m => m.MessageGame).WithMany(g => g.GameMessages).HasForeignKey(m => m.GameId).OnDelete(DeleteBehavior.Cascade); 
            modelBuilder.Entity<TournamentTable>().HasOne(tt => tt.TournamentTeam).WithMany(t => t.TeamTournamentTable).HasForeignKey(tt => tt.TeamId).OnDelete(DeleteBehavior.NoAction); 
            modelBuilder.Entity<TournamentTable>().HasOne(tt => tt.Tournament).WithMany(t => t.TournamentTable).HasForeignKey(t => t.TournamentId).OnDelete(DeleteBehavior.NoAction); 
            modelBuilder.Entity<Game>().HasOne(g => g.Tournament).WithMany(t => t.TournamentGames).HasForeignKey(g => g.TournamentId).OnDelete(DeleteBehavior.NoAction);
        }   
    }
}
