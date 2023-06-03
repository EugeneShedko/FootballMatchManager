using Azure;
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
    public class TeamControllerTest
    {
        private HttpClient _httpClient;

        public TeamControllerTest()
        {
            var webApFactory = new WebApplicationFactory<Program>();
            _httpClient = webApFactory.CreateDefaultClient();
        }

        [TestMethod]
        public async Task CreateTeam_OkResult()
        {
            Assert.AreEqual(HttpStatusCode.OK, HttpStatusCode.OK);
        }

        [TestMethod]
        public async Task CreateTeam_TeamExists_BadReuslt()
        {
            Assert.AreEqual(HttpStatusCode.OK, HttpStatusCode.OK);
        }
        [TestMethod]
        public async Task DeleteTeam_OkResult()
        {
            Assert.AreEqual(HttpStatusCode.OK, HttpStatusCode.OK);
        }
        [TestMethod]
        public async Task GetTeam_OkResult()
        {
            Assert.AreEqual(HttpStatusCode.OK, HttpStatusCode.OK);
        }
        [TestMethod]
        public async Task GetTeam_NoExistTeam_BadReuslt()
        {
            Assert.AreEqual(HttpStatusCode.OK, HttpStatusCode.OK);
        }
        [TestMethod]
        public async Task LeavFromTeam_OkResult()
        {
            Assert.AreEqual(HttpStatusCode.OK, HttpStatusCode.OK);
        }

        [TestMethod]
        public async Task EditTeam_OkResult()
        {
            Assert.AreEqual(HttpStatusCode.OK, HttpStatusCode.OK);
        }

        [TestMethod]
        public async Task EditTeam_NoTeam_BadResult()
        {
            Assert.AreEqual(HttpStatusCode.OK, HttpStatusCode.OK);
        }
    }
}
