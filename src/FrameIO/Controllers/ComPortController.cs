using AutoMapper;
using FrameHelper;
using FrameIO.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrameIO.Controllers
{
    [Route("api/[controller]")]
    public class ComPortController : ControllerHelpers
    {
        private readonly IComPortService comPortService;
        private readonly ILogger logger;
        private readonly IMapper mapper;

        public ComPortController(IComPortService comPortService, ILoggerFactory loggerFactory, IMapper mapper)
        {
            this.comPortService = comPortService;
            logger = loggerFactory.CreateLogger<ComPortController>();
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetComLog(FilterModel<ComLog> filter)
        {
            try
            {
                var result = await Task.Run(() => comPortService.GetByIdAsync(id));
                return Ok(mapper.Map<ILogView>(result));
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(1, nameof(Get)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        /// TODO: poolozás helyett majd signalR push
        public async Task<IActionResult> Get(Guid userid)
        {
            try
            {
                var result = await comPortService.GetListByUserIdAsync(userid);
                return Ok(mapper.Map<IEnumerable<ILogView>>(result));
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(2, nameof(GetByUser)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]LogView log)
        {
            try
            {
                var model = mapper.Map<ILogDTO>(log);
                if (await comPortService.SetAsync(model) == 1)
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
                logger.LogError(new EventId(3, nameof(Post)), e.Message);
                return await ExceptionResponse(e);
            }
        }
    }
}
