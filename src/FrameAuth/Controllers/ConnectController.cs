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

        public ConnectController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ILoggerFactory loggerFactory,
            IMapper mapper)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            logger = loggerFactory.CreateLogger<ConnectController>();
            this.mapper = mapper;
        }

        /// <summary>
        /// Tokenhandler
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

                // Create the principal
                var principal = await signInManager.CreateUserPrincipalAsync(user);

                // Claims will not be associated with specific destinations by default, so we must indicate whether they should
                // be included or not in access and identity tokens.
                foreach (var claim in principal.Claims)
                {
                    // For this sample, just include all claims in all token types.
                    // In reality, claims' destinations would probably differ by token type and depending on the scopes requested.
                    claim.SetDestinations(OpenIdConnectConstants.Destinations.AccessToken, OpenIdConnectConstants.Destinations.IdentityToken);
                }

                // Create a new authentication ticket for the user's principal
                var ticket = new AuthenticationTicket(
                    principal,
                    new AuthenticationProperties(),
                    OpenIdConnectServerDefaults.AuthenticationScheme);

                // Include resources and scopes, as appropriate
                var scope = new[]
                {
                    OpenIdConnectConstants.Scopes.OpenId,
                    OpenIdConnectConstants.Scopes.Email,
                    OpenIdConnectConstants.Scopes.Profile,
                    OpenIdConnectConstants.Scopes.OfflineAccess,
                    OpenIddictConstants.Scopes.Roles
                }.Intersect(request.GetScopes());

                ticket.SetResources(Startup.StaticConfig["profiles:FrameAuth:launchUrl"]);
                ticket.SetScopes(scope);

                // Sign in the user
                return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
            }
            catch (Exception e) 
            {
                logger.LogError(new EventId(5, nameof(Token)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        //
        // POST: /Account/LogOff
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> LogOff() //TODO ?????????????
        {
            try
            {
                await signInManager.SignOutAsync();
                logger.LogInformation(3, "User logged out.");
                return Ok(new JsonResult(null));
            }
            catch(Exception e)
            {
                logger.LogError(new EventId(6, nameof(Token)), e.Message);
                return await ExceptionResponse(e);
            }
        }
    }
}