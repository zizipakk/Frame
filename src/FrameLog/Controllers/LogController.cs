using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using FrameLog.Services;
using AutoMapper;
using FrameLog.Models;
using Microsoft.Extensions.Logging;
using FrameHelper;

namespace FrameLog.Controllers
{
    [Route("api/[controller]")]
    public class LogController : ControllerHelpers
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
        //[HttpGet]
        //public async Task<IEnumerable<string>> Get()
        //{

        //    return await Task.Run(() => new string[] { "value1", "value2" });
        //}

        // GET api/log/id
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            try
            {
                var result = await Task.Run(() => logService.GetByIdAsync(id));
                logger.LogInformation("Log got from resource by id.");
                return Ok(mapper.Map<ILogView>(result));
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(1, nameof(Get)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        // GET api/log/id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByUser(Guid userid)
        {
            try
            {
                var result = await logService.GetListByUserIdAsync(userid);
                logger.LogInformation("Logs got from resource by userid.");
                return Ok(mapper.Map<IEnumerable<ILogView>>(result));
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(2, nameof(GetByUser)), e.Message);
                return await ExceptionResponse(e);
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
                    logger.LogInformation("Log is saved into resource.");
                    return Ok();
                }

                logger.LogError("Log not saved!");
                throw new Exception("Badly db handling.");                
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(3, nameof(Post)), e.Message);
                return await ExceptionResponse(e);
            }
        }

    }
}
