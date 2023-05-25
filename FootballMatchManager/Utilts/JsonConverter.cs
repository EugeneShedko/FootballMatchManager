using FootballMatchManager.DataBase.Models;
using System.Text.Json.Nodes;

namespace FootballMatchManager.Utilts
{
    public class JsonConverter
    {
        public static string ConvertApUser(List<ApUser> apUsers)
        {
            JsonArray jsonArray = new JsonArray();
            foreach (ApUser apUser in apUsers)
            {
                JsonObject jsonObject = new JsonObject();
                jsonObject.Add("userFirstName", apUser.FirstName);
                jsonObject.Add("userLastName", apUser.LastName);

                jsonObject.Add("userDateOfBirth", apUser.Birth);
                jsonObject.Add("userPosition", apUser.Position);
                jsonObject.Add("userEmail", "нет комманды");

                jsonArray.Add(jsonObject);
            }

            return jsonArray.ToJsonString();
        }

        public static string ConvertGame(List<ApUser> apUsers)
        {
            JsonArray jsonArray = new JsonArray();
            foreach (ApUser apUser in apUsers)
            {
                JsonObject jsonObject = new JsonObject();


                jsonObject.Add("userFirstName", apUser.FirstName);
                jsonObject.Add("userLastName", apUser.LastName);

                jsonObject.Add("userDateOfBirth", apUser.Birth);
                jsonObject.Add("userPosition", apUser.Position);
                jsonObject.Add("userEmail", "нет комманды");

                jsonArray.Add(jsonObject);
            }

            return jsonArray.ToJsonString();
        }

        public static string ConvertComment(List<Comment> comments)
        {
            JsonArray jsonArray = new JsonArray();
            foreach (Comment comment in comments)
            {

                JsonObject jsonObject = new JsonObject();
                jsonObject.Add("pkId", comment.PkId);
                jsonObject.Add("userName", comment.Sender.FirstName + comment.Sender.LastName);
                jsonObject.Add("date", comment.Date);
                jsonObject.Add("text", comment.Text);
                jsonObject.Add("senderId", comment.FkSenderId);
                jsonObject.Add("image", comment.Sender.Image);

                jsonArray.Add(jsonObject);
            }

            return jsonArray.ToJsonString();
        }

        public static string ConvertMessage(List<Message> messages)
        {
            JsonArray jsonArray = new JsonArray();
            foreach (Message message in messages)
            {

                JsonObject jsonObject = new JsonObject();

                jsonObject.Add("pkId", message.PkId);
                jsonObject.Add("userName", message.Sender.FirstName + message.Sender.LastName);
                jsonObject.Add("date", message.DateTime);
                jsonObject.Add("text", message.Text);
                jsonObject.Add("image", message.Sender.Image);
                jsonObject.Add("senderId", message.FkSenderId);

                jsonArray.Add(jsonObject);
            }

            return jsonArray.ToJsonString();
        }
    }
}
