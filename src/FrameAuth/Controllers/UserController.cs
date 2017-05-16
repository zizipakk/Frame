using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using FrameAuth.Data;
using AutoMapper;
using System;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using FrameAuth.Models.UserViewModels;
using FrameSearch.Controllers;
using FrameSearch.ElasticSearchProvider;
using AspNet.Security.OpenIdConnect.Primitives;

namespace FrameAuth.Controllers
{
    /// <summary>
    /// SPA controller
    /// </summary>
    [Authorize]
    public class UserController : EntitySearchController<ApplicationUser, ApplicationUserSearch, string>
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly ILogger logger;
        private readonly IMapper mapper;

        public UserController(
            UserManager<ApplicationUser> userManager,
            ILoggerFactory loggerFactory,
            IMapper mapper,
            IEntitySearchProvider<ApplicationUser, ApplicationUserSearch, string> entitySearchProvider)
            : base(entitySearchProvider, loggerFactory)
        {
            this.userManager = userManager;
            logger = loggerFactory.CreateLogger<UserController>();
            this.mapper = mapper;
        }

        /// <summary>
        /// For testing
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var result = await userManager.Users.ToListAsync();
                logger.LogInformation("All user got from resource.");
                return Ok(mapper.Map<IList<UserViewModel>>(result));
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(1, nameof(GetUsers)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        // GET: /api/userinfo
        [HttpGet]
        public async Task<IActionResult> Userinfo()
        {
            try
            {
                var user = await userManager.GetUserAsync(User);

                if (user == null)
                {
                    logger.LogError("Can not resolve current user!");
                    throw new Exception("Can not resolve current user!");
                }

                // TODO: improve scope cheking
                // Note: the complete list of standard claims supported by the OpenID Connect specification
                // can be found here: http://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
                if (!User.HasClaim(OpenIdConnectConstants.Claims.Scope, OpenIdConnectConstants.Scopes.Email))
                    user.Email = "Not allowed";
                // ...
                logger.LogInformation("Scopes are checked.");

                return Ok(mapper.Map<UserViewModel>(user));
            }
            catch(Exception e)
            {
                logger.LogError(new EventId(2, nameof(Userinfo)), e.Message);
                return await ExceptionResponse(e);
            }
        }
    }   
}