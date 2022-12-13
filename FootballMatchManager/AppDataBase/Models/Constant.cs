using System.ComponentModel.DataAnnotations.Schema;

namespace FootballMatchManager.DataBase.Models
{
    [Table("CONSTANT")]
    public class Constant
    {
        [Column("constantid")]
        public int  ConstantId { get; set; }
        [Column("constanttype")]
        public string ConstantType { get; set; }
        [Column("constantname")]
        public string ConstantName { get; set; }
        [Column("constantvalue")]
        public int  ConstantValue { get; set; }

    }
}
