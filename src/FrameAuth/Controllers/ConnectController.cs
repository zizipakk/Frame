using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AspNet.Security.OpenIdConnect.Primitives;
using AspNet.Security.OpenIdConnect.Extensions;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http.Authentication;
using AspNet.Security.OpenIdConnect.Server;
using OpenIddict.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using FrameAuth.Data;
using AutoMapper;
using System;
using Microsoft.Extensions.Logging;
using FrameHelper;
using System.Collections.Generic;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Builder;
using System.Diagnostics;

namespace FrameAuth.Controllers
{
    /// <summary>
    /// SPA auth controller, with openid tokenhandler, and identity claims handler
    /// exceptionhandling to response
    /// </summary>
    [Authorize]
    public class ConnectController : ControllerHelpers
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly ILogger logger;
        private readonly IMapper mapper;
        private readonly IOptions<IdentityOptions> identityOptions;

        public ConnectController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ILoggerFactory loggerFactory,
            IMapper mapper,
            IOptions<IdentityOptions> identityOptions)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            logger = loggerFactory.CreateLogger<ConnectController>();
            this.mapper = mapper;
            this.identityOptions = identityOptions;
        }

        /// <summary>
        /// Authentication and Tokenhandler
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Token(OpenIdConnectRequest request)
        {
            try
            {
                if (!request.IsPasswordGrantType())
                {
                    // Return bad request if the request is not for password grant type
                    logger.LogError(1, "Grant type is missing from request.");
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.UnsupportedGrantType,
                        ErrorDescription = "The specified grant type is not supported."
                    });
                }

                //var user = await _userManager.FindByNameAsync(request.Username);
                var user = await userManager.FindByEmailAsync(request.Username);
                if (user == null)
                {
                    // Return bad request if the user doesn't exist
                    logger.LogError(2, "Not found user.");
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "Invalid username or password"
                    });
                }

                // Check that the user can sign in and is not locked out.
                // If two-factor authentication is supported, it would also be appropriate to check that 2FA is enabled for the user
                if (!await signInManager.CanSignInAsync(user) || (userManager.SupportsUserLockout && await userManager.IsLockedOutAsync(user)))
                {
                    // Return bad request is the user can't sign in
                    logger.LogError(3, "The specified user cannot sign in.");
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The specified user cannot sign in."
                    });
                }

                if (!await userManager.CheckPasswordAsync(user, request.Password))
                {
                    // Return bad request if the password is invalid
                    logger.LogError(4, "Invalid username or password.");
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "Invalid username or password"
                    });
                }

                logger.LogInformation(1, "User logged in.");

                // The user is now validated, so reset lockout counts, if necessary
                if (userManager.SupportsUserLockout)
                {
                    logger.LogInformation(2, "Lock-counter reseted.");
                    await userManager.ResetAccessFailedCountAsync(user);
                }

                // Create a new authentication ticket.
                var ticket = await CreateTicketAsync(request, user);
                               
                // Sign in the user
                return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
            }
            catch (Exception e) 
            {
                logger.LogError(new EventId(5, nameof(Token)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Authorize(OpenIdConnectRequest request)
        {
            Debug.Assert(request.IsAuthorizationRequest(),
                "The OpenIddict binder for ASP.NET Core MVC is not registered. " +
                "Make sure services.AddOpenIddict().AddMvcBinders() is correctly called.");

            try
            {
                if (!User.Identity.IsAuthenticated)
                {
                    //// If the client application request promptless authentication,
                    //// return an error indicating that the user is not logged in.
                    //if (request.HasPrompt(OpenIdConnectConstants.Prompts.None))
                    //{
                    //    var properties = new AuthenticationProperties(new Dictionary<string, string>
                    //    {
                    //        [OpenIdConnectConstants.Properties.Error] = OpenIdConnectConstants.Errors.LoginRequired,
                    //        [OpenIdConnectConstants.Properties.ErrorDescription] = "The user is not logged in."
                    //    });

                    //    // Ask OpenIddict to return a login_required error to the client application.
                    //    return Forbid(properties, OpenIdConnectServerDefaults.AuthenticationScheme);
                    //}
                    return Challenge();
                }

                // Retrieve the profile of the logged in user.
                var user = await userManager.GetUserAsync(User);
                if (user == null)
                    throw new Exception("User is authenticated, but cannot resolve!");

                // Create a new authentication ticket.
                var ticket = await CreateTicketAsync(request, user);

                // Returning a SignInResult will ask OpenIddict to issue the appropriate access/identity tokens.
                return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(5, nameof(Authorize)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        /// <summary>
        /// End of auth session
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> LogOff() //TODO ?????????????
        {
            try
            {               
                logger.LogInformation(3, "User logged out.");
                //return Ok(new JsonResult(null));
                // Returning a SignOutResult will ask OpenIddict to redirect the user agent
                // to the post_logout_redirect_uri specified by the client application.
                return SignOut(OpenIdConnectServerDefaults.AuthenticationScheme);

            }
            catch (Exception e)
            {
                logger.LogError(new EventId(6, nameof(Token)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        private async Task<AuthenticationTicket> CreateTicketAsync(OpenIdConnectRequest request, ApplicationUser user)
        {
            // Create the principal
            var principal = await signInManager.CreateUserPrincipalAsync(user);

            // Create a new authentication ticket for the user's principal
            var ticket = new AuthenticationTicket(
                principal,
                new AuthenticationProperties(),
                OpenIdConnectServerDefaults.AuthenticationScheme);

            // Include resources and scopes, as appropriate
            ticket.SetScopes(new[]
            {
                    OpenIdConnectConstants.Scopes.OpenId,
                    OpenIdConnectConstants.Scopes.Email,
                    OpenIdConnectConstants.Scopes.Profile,
                    OpenIddictConstants.Scopes.Roles
                }.Intersect(request.GetScopes()));

            //TODO: authorized(external) resources audiences
            ticket.SetResources(
                //Startup.StaticConfig["profiles:FrameAuth:launchUrl"],
                Startup.StaticConfig["AppSources:FrameAuth"],
                Startup.StaticConfig["AppSources:FrameIO"]
            );

            ticket.Principal.Claims.ToList().ForEach(claim =>
            {
                // Never include the security stamp in the access and identity tokens, as it's a secret value.
                if (claim.Type != identityOptions.Value.ClaimsIdentity.SecurityStampClaimType)
                {

                    var destinations = new List<string>
                        {
                            OpenIdConnectConstants.Destinations.AccessToken
                        };

                    // Only add the iterated claim to the id_token if the corresponding scope was granted to the client application.
                    // The other claims will only be added to the access_token, which is encrypted when using the default format.
                    if ((claim.Type == OpenIdConnectConstants.Claims.Name && ticket.HasScope(OpenIdConnectConstants.Scopes.Profile)) ||
                        (claim.Type == OpenIdConnectConstants.Claims.Email && ticket.HasScope(OpenIdConnectConstants.Scopes.Email)) ||
                        (claim.Type == OpenIdConnectConstants.Claims.Role && ticket.HasScope(OpenIddictConstants.Claims.Roles)))
                    {
                        destinations.Add(OpenIdConnectConstants.Destinations.IdentityToken);
                    }

                    claim.SetDestinations(destinations);
                }
            });

            return ticket;
        }
    }
}