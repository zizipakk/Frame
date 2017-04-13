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
        private readonly IEntitySearchProvider<ApplicationUser, ApplicationUserSearch, string> entitySearchProvider;

        public UserController(
            UserManager<ApplicationUser> userManager,
            ILoggerFactory loggerFactory,
            IMapper mapper,
            IEntitySearchProvider<ApplicationUser, ApplicationUserSearch, string> entitySearchProvider)
            : base(entitySearchProvider, loggerFactory)
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
                logger.LogError(new EventId(1, nameof(GetUsers)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        
    }   
}