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

                /*Возможно я убрал, что бы подтягивался пользователь -> вернуть*/
                jsonObject.Add("commentUserName", comment.ApUserSender.UserFirstName + comment.ApUserSender.UserLastName);
                jsonObject.Add("commentDate", comment.CommentDateTime);
                jsonObject.Add("commentText", comment.CommentText);
                jsonObject.Add("userSender", comment.CommentSender);
                jsonObject.Add("commentId", comment.CommentId);

                jsonArray.Add(jsonObject);
            }

            return jsonArray.ToJsonString();
        }
    }
}
