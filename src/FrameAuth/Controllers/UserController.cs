using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AspNet.Security.OpenIdConnect.Primitives;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using FrameAuth.Data;
using AutoMapper;
using System;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using FrameAuth.Models.UserViewModels;

namespace FrameAuth.Controllers
{
    [Authorize]
    public class UserController : Controller
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly ILogger logger;
        private readonly IMapper mapper;

        public UserController(
            UserManager<ApplicationUser> userManager,
            ILoggerFactory loggerFactory,
            IMapper mapper)
        {
            this.userManager = userManager;
            this.logger = loggerFactory.CreateLogger<UserController>();
            this.mapper = mapper;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var result = await userManager.Users.ToListAsync();
                return Ok(mapper.Map<IList<UserViewModel>>(result));
            }
            catch (Exception e)
            {
                logger.LogError(1, e.Message);
                // TODO 500-at elnyomja a kestrel, szóval ezt nem engedi át
                return BadRequest(new OpenIdConnectResponse
                {
                    Error = e.Message,
                    ErrorDescription = e.InnerException.Message ?? e.InnerException.InnerException.Message
                });
            }
        }
    }
}