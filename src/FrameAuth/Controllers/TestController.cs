using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using FrameAuth.Data;
using FrameSearch.Controllers;
using FrameSearch.ElasticSearchProvider;

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
