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
    public class ComConfigController : ControllerHelpers
    {
        private readonly IComConfigService comConfigService;
        private readonly ILogger logger;
        private readonly IMapper mapper;

        public ComConfigController(IComConfigService comConfigService, ILoggerFactory loggerFactory, IMapper mapper)
        {
            this.comConfigService = comConfigService;
            logger = loggerFactory.CreateLogger<ComConfigController>();
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetPortConfig()
        {
            try
            {
                var result = await Task.Run(() => comConfigService.GetByIdAsync(id));
                return Ok(mapper.Map<ILogView>(result));
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(1, nameof(Get)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        [HttpPost]
        public async Task<IActionResult> SetPortConfig()
        {
            try
            {
                var result = await Task.Run(() => comConfigService.GetByIdAsync(id));
                return Ok(mapper.Map<ILogView>(result));
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(1, nameof(Get)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetDeviceConfig()
        {
            try
            {
                var result = await Task.Run(() => comConfigService.GetByIdAsync(id));
                return Ok(mapper.Map<ILogView>(result));
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(1, nameof(Get)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        [HttpPost]
        public async Task<IActionResult> SetDeviceConfig(DeviceConfigViewModel model)
        {
            try
            {
                var result = await Task.Run(() => comConfigService.GetByIdAsync(id));
                return Ok(mapper.Map<ILogView>(result));
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(1, nameof(Get)), e.Message);
                return await ExceptionResponse(e);
            }
        }

    }
}
