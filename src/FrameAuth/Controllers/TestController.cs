using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using FrameAuth.Data;
using FrameHelper;
using FrameSearch.Controllers;
using FrameSearch.ElasticSearchProvider;
using System;

namespace FrameAuth.Controllers
{
    [Authorize]
    public class TestController :
        //ControllerHelpers
        EntitySearchController<ApplicationUser,ApplicationUserSearch,string>
    {
        public TestController(
            IEntitySearchProvider<ApplicationUser, ApplicationUserSearch, string> entitySearchProvider,
            ILoggerFactory loggerFactory
            )
            : base(entitySearchProvider, loggerFactory)
        {
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult TestGet()
        {
            return Ok("TESTGET is OK");
            //return Ok(Test());
        }

    }
}
