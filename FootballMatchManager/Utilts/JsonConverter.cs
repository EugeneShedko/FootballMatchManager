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
                jsonObject.Add("userFirstName", apUser.UserFirstName);
                jsonObject.Add("userLastName", apUser.UserLastName);

                jsonObject.Add("userDateOfBirth", apUser.UserDateOfBirth);
                jsonObject.Add("userPosition", apUser.UserPosition);
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


                jsonObject.Add("userFirstName", apUser.UserFirstName);
                jsonObject.Add("userLastName", apUser.UserLastName);

                jsonObject.Add("userDateOfBirth", apUser.UserDateOfBirth);
                jsonObject.Add("userPosition", apUser.UserPosition);
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

                jsonObject.Add("commentUserName", comment.ApUserSender.UserFirstName + comment.ApUserSender.UserLastName);
                jsonObject.Add("commentDate", comment.CommentDateTime);
                jsonObject.Add("commentText", comment.CommentText);
                jsonObject.Add("userSender", comment.CommentSender);
                jsonObject.Add("commentId", comment.CommentId);
                jsonObject.Add("userImage", comment.ApUserSender.UserImage);

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

                jsonObject.Add("messageUserName", message.ApUserSender.UserFirstName + message.ApUserSender.UserLastName);
                jsonObject.Add("messageDate", message.MessageDateTime);
                jsonObject.Add("messageText", message.MessageText);
                jsonObject.Add("userImage", message.ApUserSender.UserImage);

                jsonArray.Add(jsonObject);
            }

            return jsonArray.ToJsonString();
        }

    }
}
