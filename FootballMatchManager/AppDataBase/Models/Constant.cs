using System.ComponentModel.DataAnnotations.Schema;

namespace FootballMatchManager.DataBase.Models
{
    [Table("CONSTANT")]
    public class Constant
    {
        [Column("constantid")]
        public int  ConstantId { get; set; }
        [Column("constanttype")]
        public char ConstantType { get; set; }
        [Column("constantname")]
        public char ConstantName { get; set; }
        [Column("constantvalue")]
        public int  ConstantValue { get; set; }

    }
}
