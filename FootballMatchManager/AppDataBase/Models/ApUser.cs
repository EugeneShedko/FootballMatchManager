using System.ComponentModel.DataAnnotations.Schema;

namespace FootballMatchManager.DataBase.Models
{
    [Table("APUSER")]
    public class ApUser
    {
        [Column("apuserid")]
        public int ApUserId { get; set; }
        [Column("useremail")]
        public string? UserEmail { get; set; }
        [Column("userpassword")]
        public string? UserPassword { get; set; }
        [Column("userrole")]
        public string? UserRole { get; set; }
        [Column("userfirstname")]
        public string? UserFirstName { get; set; }
        [Column("userlastname")]
        public string? UserLastName { get; set; }
        [Column("usersex")]
        public string? UserSex { get; set; }
        [Column("userposition")]
        public string? UserPosition { get; set; }
        [Column("userdateofbirth")]
        public DateTime? UserDateOfBirth {get;set;}
        [Column("gamesnumber")]
        public string? GamesNumber { get; set; } = "0";
        [Column("goalsnumber")]
        public string? GoalsNumber { get; set; } = "0";
        [Column("assistsnumber")]
        public string? AssistsNumber { get; set; } = "0";
        [Column("userstatus")]
        public string? UserStatus { get; set; }
        [Column("userimage")]
        public string? UserImage { get; set; } = "default-profile-icon.jpg";

        public List<Comment> UserCommentsRecipients { get; set; }
        public List<Comment> UserCommentSenders { get; set; }
        public List<Message> UserMessages { get; set; }
        public List<ApUserGame> ApUserGame { get; set; }

        /*
        public List<Tournament> UserTournaments { get; set; }
        public List<ApUserTeam> UserTeams { get; set; }
        public List<Notification> UserNotifications { get; set; }
        public List<Request> UserRequestsRecipients { get; set; }
        public List<Request> UserRequestsSenders { get; set; }
        */
    }
}
