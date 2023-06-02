using System.ComponentModel.DataAnnotations.Schema;

namespace DataBaseManager.AppDataBase.Models
{
    [Table("CONSTANT")]
    public class Constant
    {
        [Column("pkid")]
        public int  PkId { get; set; }
        [Column("group")]
        public string? Group { get; set; }
        [Column("type")]
        public string? Type { get; set; }
        [Column("name")]
        public string Name { get; set; }
        [Column("strvalue")]
        public string? StrValue { get; set; }
        [Column("decvalue")]
        public int? DecValue { get; set; }

    }
}
