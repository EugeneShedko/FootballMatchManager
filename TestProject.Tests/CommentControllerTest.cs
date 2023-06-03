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
    public class CommentControllerTest
    {
        private HttpClient _httpClient;

        public CommentControllerTest()
        {
            var webApFactory = new WebApplicationFactory<Program>();
            _httpClient = webApFactory.CreateDefaultClient();
        }

        [TestMethod]
        public async Task DeleteComment_Comment_OkResult()
        {

            var response = await _httpClient.DeleteAsync("api/comment/delete-comment/7");
            Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
        }
    }
}
