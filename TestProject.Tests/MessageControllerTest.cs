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
    public class MessageControllerTest
    {
        private HttpClient _httpClient;

        public MessageControllerTest()
        {
            var webApFactory = new WebApplicationFactory<Program>();
            _httpClient = webApFactory.CreateDefaultClient();
        }

        [TestMethod]
        public async Task GetEntityMessage_OkResult()
        {

            var response = await _httpClient.GetAsync("api/message/entity-messages/game/1011");
            Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
        }

        [TestMethod]
        public async Task DeleteMessage_OkResult()
        {
            var response = await _httpClient.DeleteAsync("api/message/delete-message/2");
            Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
        }

        [TestMethod]
        public async Task DeleteMessage_NoMessage_BadResult()
        {
            var response = await _httpClient.DeleteAsync("api/message/delete-message/10");
            Assert.AreEqual(HttpStatusCode.BadRequest, response.StatusCode);
        }
    }
}
