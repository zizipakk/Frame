using FrameSearch.ElasticSearchProvider;
using Microsoft.AspNetCore.Mvc;

namespace FrameSearch.Controllers
{
    [Route("api/[controller]")]
    public class EntitySearchController<TEntity, TDTO, TId> : Controller
    {
        private readonly IEntitySearchProvider<TEntity, TDTO, TId> entitySearchProvider;

        public EntitySearchController(IEntitySearchProvider<TEntity, TDTO, TId> entitySearchProvider)
        {
            this.entitySearchProvider = entitySearchProvider;
        }

        [HttpGet("search/{from}/{searchtext}")]
        public virtual IActionResult Search(string searchtext, int from)
        {
            return Ok(entitySearchProvider.Search(searchtext.ToLower(), from));
        }

        [HttpGet("querystringsearch/{searchtext}")]
        public virtual IActionResult QueryString(string searchtext)
        {
            return Ok(entitySearchProvider.QueryString(searchtext));
        }

        [HttpGet("autocomplete/{searchtext}")]
        public virtual IActionResult AutoComplete(string searchtext)
        {
            return Ok(entitySearchProvider.AutocompleteSearch(searchtext.ToLower()));
        }

        [HttpGet("createindex")]
        public virtual IActionResult CreateIndex()
        {
            entitySearchProvider.CreateIndex();
            return Ok("index created");
        }

        //[HttpGet("createtestdata")]
        //public IActionResult CreateTestData()
        //{
        //    entitySearchProvider.CreateTestData();
        //    return Ok("test data created");
        //}   WS-L0015547  6hBm7Dxr

        [HttpGet("indexexists")]
        public virtual IActionResult GetElasticsearchStatus()
        {
            return Ok(entitySearchProvider.GetStatus());
        }
    }
}
