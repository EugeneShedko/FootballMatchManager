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

                jsonObject.Add("commentUserName", comment.Sender.FirstName + comment.Sender.LastName);
                jsonObject.Add("commentDate", comment.Date);
                jsonObject.Add("commentText", comment.Text);
                jsonObject.Add("userSender", comment.FkSenderId);
                jsonObject.Add("commentId", comment.PkId);
                jsonObject.Add("userImage", comment.Sender.Image);

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

                jsonObject.Add("messageUserName", message.Sender.FirstName + message.Sender.LastName);
                jsonObject.Add("messageDate", message.DateTime);
                jsonObject.Add("messageText", message.Text);
                jsonObject.Add("userImage", message.Sender.Image);

                jsonArray.Add(jsonObject);
            }

            return jsonArray.ToJsonString();
        }

    }
}
