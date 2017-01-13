using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using IdentityServer4.Models;

namespace Frame
{
    public class Config
    {
        public static IEnumerable<IdentityResource> GetIdentityResources()
        {
            return new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
                //new IdentityResources.Email(),
                new IdentityResource("recordsscope",new []{ "role", "admin", "user" })
            };
        }

        public static IEnumerable<ApiResource> GetApiResources()
        {
            return new List<ApiResource>
            {
                new ApiResource("records")
                {
                    ApiSecrets =
                    {
                        new Secret("dataSecret".Sha256())
                    },
                    Scopes =
                    {
                        new Scope
                        {
                            Name = "dataScope",
                            DisplayName = "Scope for the ApiResource"
                        }
                    },
                    UserClaims = { "role", "admin", "user" }
                }
            };
        }

        // clients want to access resources (aka scopes)
        public static IEnumerable<Client> GetClients()
        {
            var builder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile("./Properties/launchSettings.json", optional: true, reloadOnChange: true)
                ;

            var configuration = builder.Build();

            // client credentials client
            return new List<Client>
            {
                new Client
                {
                    ClientName = "angular2client",
                    ClientId = "angular2client",
                    AccessTokenType = AccessTokenType.Reference,
                    //AccessTokenLifetime = 600, // 10 minutes, default 60 minutes
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AllowAccessTokensViaBrowser = true,
                    RedirectUris = new List<string>
                    {
                        configuration["Frame:launchUrl"]
                    },
                    PostLogoutRedirectUris = new List<string>
                    {
                        configuration["Frame:launchUrl"]
                    },
                    AllowedCorsOrigins = new List<string>
                    {
                        configuration["CORS:ClientDomain"]
                    },
                    AllowedScopes = new List<string>
                    {
                        "openid",
                        "role"
                    }
                }
            };
        }
    }
}
