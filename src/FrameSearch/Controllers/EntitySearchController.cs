using FrameHelper;
using FrameSearch.ElasticSearchProvider;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace FrameSearch.Controllers
{
    [Route("api/[controller]")]
    public class EntitySearchController<TEntity, TDTO, TId> : ControllerHelpers
    {
        private readonly IEntitySearchProvider<TEntity, TDTO, TId> entitySearchProvider;
        private readonly ILogger logger;

        public EntitySearchController(IEntitySearchProvider<TEntity, TDTO, TId> entitySearchProvider, ILoggerFactory loggerFactory)
        {
            this.entitySearchProvider = entitySearchProvider;
            this.logger = loggerFactory.CreateLogger<EntitySearchController<TEntity, TDTO, TId>>();
        }

        [HttpGet("search/{from}/{searchtext}")]
        public virtual async Task<IActionResult> SearchAsync(string searchtext, int from)
        {
            try
            {
                return Ok(entitySearchProvider.Search(searchtext.ToLower(), from));
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(1, nameof(SearchAsync)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        [HttpGet("querystringsearch/{searchtext}")]
        public virtual async Task<IActionResult> QueryString(string searchtext)
        {
            try
            {
                return Ok(entitySearchProvider.QueryString(searchtext));
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(1, nameof(QueryString)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        [HttpGet("autocomplete/{searchtext}")]
        public virtual async Task<IActionResult> AutoComplete(string searchtext)
        {
            try
            {
                return Ok(entitySearchProvider.AutocompleteSearch(searchtext.ToLower()));
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(1, nameof(AutoComplete)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        [HttpGet("createindex")]
        public virtual async Task<IActionResult> CreateIndex()
        {
            try
            {
                entitySearchProvider.CreateIndex();
                return Ok("index created");
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(1, nameof(CreateIndex)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        //[HttpGet("createtestdata")]
        //public IActionResult CreateTestData()
        //{
        //    entitySearchProvider.CreateTestData();
        //    return Ok("test data created");
        //}   WS-L0015547  6hBm7Dxr

        [HttpGet("indexexists")]
        public virtual async Task<IActionResult> GetElasticsearchStatus()
        {
            try
            {
                return Ok(entitySearchProvider.GetStatus());
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(1, nameof(GetElasticsearchStatus)), e.Message);
                return await ExceptionResponse(e);
            }
        }
    }
}
