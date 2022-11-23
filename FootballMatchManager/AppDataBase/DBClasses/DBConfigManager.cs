using Microsoft.EntityFrameworkCore;

namespace FootballMatchManager.DataBase.DBClasses
{
    public class DBConfigManager
    {
        public static DbContextOptions<AppDBContext> GetDbOptions()
        {
            var builder = new ConfigurationBuilder();
            builder.SetBasePath(Directory.GetCurrentDirectory());
            builder.AddJsonFile("AppDataBase/ConfigurationFiles/mssqlconfig.json");

            var config = builder.Build();
            string connectionString = config.GetConnectionString("DefaultConnection");

            var optionsBuilder = new DbContextOptionsBuilder<AppDBContext>();
            return optionsBuilder.UseSqlServer(connectionString).Options;

        }
    }
}
