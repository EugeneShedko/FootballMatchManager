using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FootballMatchManager.Utilts
{
    public class JwtService
    {
        private string secureKey = "Manchester United The Best Club";

        public string GenerateToken(int id)
        {
            var symmetricalSecureKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secureKey));
            var credentials = new SigningCredentials(symmetricalSecureKey, SecurityAlgorithms.HmacSha256);

            var header = new JwtHeader(credentials);
            var payload = new JwtPayload(id.ToString(), null, null, null, DateTime.Today.AddDays(1));

            var securityToken = new JwtSecurityToken(header, payload);

            return new JwtSecurityTokenHandler().WriteToken(securityToken);
        }

        public JwtSecurityToken Verify(string jwtToken)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(secureKey);
            tokenHandler.ValidateToken(jwtToken, new TokenValidationParameters
            {
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuerSigningKey = true,
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = false
            }, out SecurityToken validatedToken);

            return (JwtSecurityToken)validatedToken;
        }
    }
}
