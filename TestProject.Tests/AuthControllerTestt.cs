using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.VisualStudio.TestPlatform.TestHost;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;

namespace TestProject.Tests
{
    [TestClass]
    public class AuthControllerTest
    {

        private HttpClient _httpClient;

        public AuthControllerTest() 
        {
            var webApFactory = new WebApplicationFactory<Program>();
            _httpClient = webApFactory.CreateDefaultClient();
        }

        [TestMethod]
        public async Task Authorisation_User_OkResult()
        {

            var formData = new List<KeyValuePair<string, string>>
                {
                    new KeyValuePair<string, string>("userEmail", "admin@mail.ru"),
                    new KeyValuePair<string, string>("userPassword", "11111"),
                };

            var content = new FormUrlEncodedContent(formData);

            var response = await _httpClient.PostAsync("api/auth/login", content);
            Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
        }

        [TestMethod]
        public async Task Authorisazion_NoUser_BadResult()
        {
            var formData = new List<KeyValuePair<string, string>>
                {
                    new KeyValuePair<string, string>("userEmail", "vvvv@mail.ru"),
                    new KeyValuePair<string, string>("userPassword", "11111"),
                };

            var content = new FormUrlEncodedContent(formData);

            var response = await _httpClient.PostAsync("api/auth/login", content);
            Assert.AreEqual(HttpStatusCode.BadRequest, response.StatusCode);
        }
        [TestMethod]
        public async Task Authorisation_UnCorrectPassword_BadResult()
        {
            var formData = new List<KeyValuePair<string, string>>
                {
                    new KeyValuePair<string, string>("userEmail", "z@mail.ru"),
                    new KeyValuePair<string, string>("userPassword", "22222"),
                };

            var content = new FormUrlEncodedContent(formData);

            var response = await _httpClient.PostAsync("api/auth/login", content);
            Assert.AreEqual(HttpStatusCode.BadRequest, response.StatusCode);
        }
    }
}