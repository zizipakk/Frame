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
using Frame.Models;
using AutoMapper;
using System;
using Microsoft.Extensions.Logging;

namespace Frame.Controllers
{
    [Authorize]
    public class ConnectController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ILogger _logger;
        private readonly IMapper _mapper;

        public ConnectController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ILoggerFactory loggerFactory,
            IMapper mapper)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = loggerFactory.CreateLogger<ConnectController>();
            _mapper = mapper;
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
                    _logger.LogError(1, "Grant type is missing from request.");
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.UnsupportedGrantType,
                        ErrorDescription = "The specified grant type is not supported."
                    });
                }

                //var user = await _userManager.FindByNameAsync(request.Username);
                var user = await _userManager.FindByEmailAsync(request.Username);
                if (user == null)
                {
                    // Return bad request if the user doesn't exist
                    _logger.LogError(2, "Not found user.");
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "Invalid username or password"
                    });
                }

                // Check that the user can sign in and is not locked out.
                // If two-factor authentication is supported, it would also be appropriate to check that 2FA is enabled for the user
                if (!await _signInManager.CanSignInAsync(user) || (_userManager.SupportsUserLockout && await _userManager.IsLockedOutAsync(user)))
                {
                    // Return bad request is the user can't sign in
                    _logger.LogError(3, "The specified user cannot sign in.");
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The specified user cannot sign in."
                    });
                }

                if (!await _userManager.CheckPasswordAsync(user, request.Password))
                {
                    // Return bad request if the password is invalid
                    _logger.LogError(4, "Invalid username or password.");
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "Invalid username or password"
                    });
                }

                _logger.LogInformation(1, "User logged in.");

                // The user is now validated, so reset lockout counts, if necessary
                if (_userManager.SupportsUserLockout)
                {
                    _logger.LogInformation(2, "Lock-counter reseted.");
                    await _userManager.ResetAccessFailedCountAsync(user);
                }

                // Create the principal
                var principal = await _signInManager.CreateUserPrincipalAsync(user);

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

                ticket.SetResources(Frame.Startup.StaticConfig["profiles:Frame:launchUrl"]);
                ticket.SetScopes(scope);

                // Sign in the user
                //var response = _mapper.Map<OpenIdConnectResponse>(SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme));
                //response.State = request.State;
                //return Ok(response);
                return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
            }
            catch (Exception e) 
            {
                _logger.LogError(5, e.Message);
                // TODO 500-at elnyomja a kestrel, szóval ezt nem engedi át
                return BadRequest(new OpenIdConnectResponse
                {
                    Error = e.Message,
                    ErrorDescription = e.InnerException.Message ?? e.InnerException.InnerException.Message
                });
            }
        }

        //
        // POST: /Account/LogOff
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> LogOff()
        {
            await _signInManager.SignOutAsync();
            _logger.LogInformation(3, "User logged out.");

            return Ok(new JsonResult(null));
        }
    }
}