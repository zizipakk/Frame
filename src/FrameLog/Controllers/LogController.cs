using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using FrameLog.Services;
using AutoMapper;
using FrameLog.Models;
using Microsoft.Extensions.Logging;

namespace FrameLog.Controllers
{
    [Route("api/[controller]")]
    public class LogController : Controller
    {
        private readonly ILogService logService;
        private readonly ILogger logger;
        private readonly IMapper mapper;

        public LogController(ILogService logService, ILoggerFactory loggerFactory, IMapper mapper)
        {
            this.logService = logService;
            logger = loggerFactory.CreateLogger<LogController>();
            this.mapper = mapper;
        }

        // TODO: Test
        // GET api/log
        [HttpGet]
        public async Task<IEnumerable<string>> Get()
        {

            return await Task.Run(() => new string[] { "value1", "value2" });
        }

        // GET api/log/id
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            try
            {
                var result = await Task.Run(() => logService.GetByIdAsync(id));
                return Ok(mapper.Map<ILogView>(result));
            }
            catch (Exception e)
            {
                logger.LogError(1, e.Message);
                return BadRequest(new JsonResult(e.Message));
            }
        }

        // GET api/log/id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByUser(Guid userid)
        {
            try
            {
                var result = await logService.GetListByUserIdAsync(userid);
                return Ok(mapper.Map<IEnumerable<ILogView>>(result));
            }
            catch (Exception e)
            {
                logger.LogError(2, e.Message);
                return BadRequest(e.Message);
            }
        }

        // POST api/log
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]LogView log)
        {
            try
            {
                var model = mapper.Map<ILogDTO>(log);
                if (await logService.SetAsync(model) == 1)
                {
                    return Ok();
                }
                else
                {
                    throw new Exception("Badly db handling");
                }
            }
            catch (Exception e)
            {
                logger.LogError(3, e.Message);
                return BadRequest(e.Message);
            }
        }

    }
}
