using FootballMatchManager.AppDataBase.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace FootballMatchManager.DataBase.Models
{
    [Table("APUSER")]
    public class ApUser
    {
        [Column("pkid")]
        public int PkId { get; set; }
        [Column("email")]
        public string Email { get; set; }
        [Column("password")]
        public string Password { get; set; }
        [Column("role")]
        public string? Role { get; set; }
        [Column("firstname")]
        public string? FirstName { get; set; }
        [Column("lastname")]
        public string? LastName { get; set; }
        [Column("sex")]
        public string? Sex { get; set; }
        [Column("position")]
        public string? Position { get; set; }
        [Column("birth")]
        public DateTime? Birth {get;set;}
        [Column("gamesQnt")]
        public int? GamesQnt { get; set; }
        [Column("goalsQnt")]
        public int? GoalsQnt { get; set; }
        [Column("assistsQnt")]
        public int? AssistsQnt { get; set; }
        [Column("status")]
        public string? Status { get; set; }
        [Column("image")]
        public string? Image { get; set; }

        public List<Comment> CommentsRecipients { get; set; }
        public List<Comment> CommentSenders { get; set; }
        public List<Message> Messages { get; set; }
        public List<ApUserGame> ApUserGame { get; set; }
        public List<ApUserTeamGame> ApUserTeamGames { get; set; }
        public List<ApUserTeam> Teams { get; set; }
        public List<Notification> NotificationsRecipients { get; set; }
        public List<Notification> NotificationsSenders { get; set; }
        public List<GameEvent> GameEvents { get; set; } 
        public List<GameEvent> GameEventsEntity1 { get; set; }
        public List<GameEvent> GameEventsEntity2 { get; set; }
        public List<BlockApUser> ApUserBlocks { get; set; }

        public ApUser() { }
        public ApUser(string email, string password, string role, string firstname, string lastname, string sex, string position,
                      DateTime birth, string status)
        {
            this.Email = email;
            this.Password = password;
            this.Role = role;
            this.FirstName = firstname;
            this.LastName = lastname;
            this.Sex = sex;
            this.Position = position;
            this.Birth = birth;
            this.Status = status;
            this.GamesQnt = 0;
            this.GoalsQnt = 0;
            this.AssistsQnt = 0;
            this.Image = "default-profile-icon.jpg";
        }
    }
}
