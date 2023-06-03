using Microsoft.AspNetCore.Mvc.Testing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace TestProject.Tests
{
    [TestClass]
    public class GameControllerTest
    {
        private HttpClient _httpClient;

        public GameControllerTest()
        {
            var webApFactory = new WebApplicationFactory<Program>();
            _httpClient = webApFactory.CreateDefaultClient();
        }

        [TestMethod]
        public async Task AddToGame_OkResult()
        {

            var formData = new List<KeyValuePair<string, string>>
                {
                    new KeyValuePair<string, string>("gameId", "1011"),
                    new KeyValuePair<string, string>("userId", "5"),
                };

            var content = new FormUrlEncodedContent(formData);

            var response = await _httpClient.PostAsync("api/profile/add-to-game", content);
            Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
        }
        [TestMethod]
        public async Task AddToGame_PlayersOverflow_BadRequest()
        {
            var formData = new List<KeyValuePair<string, string>>
                {
                    new KeyValuePair<string, string>("gameId", "1011"),
                    new KeyValuePair<string, string>("userId", "5"),
                };

            var content = new FormUrlEncodedContent(formData);

            var response = await _httpClient.PostAsync("api/profile/add-to-game", content);
            Assert.AreEqual(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [TestMethod]
        public async Task AddToGame_NoGame_BadRequest()
        {
            var formData = new List<KeyValuePair<string, string>>
                {
                    new KeyValuePair<string, string>("gameId", "50000"),
                    new KeyValuePair<string, string>("userId", "5"),
                };

            var content = new FormUrlEncodedContent(formData);

            var response = await _httpClient.PostAsync("api/profile/add-to-game", content);
            Assert.AreEqual(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [TestMethod]
        public async Task LeavFromGame_OkResult()
        {

            var response = await _httpClient.DeleteAsync("api/profile/leave-from-game/1011/5");
            Assert.AreEqual(HttpStatusCode.BadRequest, response.StatusCode);

        }

        [TestMethod]
        public async Task DeleteGame_OkResult()
        {

            var response = await _httpClient.DeleteAsync("api/profile/delete-game/1010");
            Assert.AreEqual(HttpStatusCode.BadRequest, response.StatusCode);
        }
    }
}
