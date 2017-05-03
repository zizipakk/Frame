using AutoMapper;
using FrameHelper;
using FrameIO.Data;
using FrameIO.Models;
using FrameIO.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace FrameIO.Controllers
{
    [Authorize]
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
        public async Task<IActionResult> GetPortType()
        {
            try
            {
                var result = await comConfigService.GetPortType();
                return Ok(mapper.Map<IComPortTypeView>(result));
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(1, nameof(GetPortType)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        [HttpPost]
        public async Task<IActionResult> SetPortType(ComPortTypeView model)
        {
            try
            {
                return await comConfigService.SetPortType(model) > 0
                    ? Ok()
                    : throw new Exception("Can not write port type");
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(2, nameof(SetPortType)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetPortConfig()
        {
            try
            {
                var result = await comConfigService.GetPortConfig();
                return Ok(mapper.Map<IComPortConfigView>(result));
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(3, nameof(GetPortConfig)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        [HttpPost]
        public async Task<IActionResult> SetPortConfig(ComPortConfigView model)
        {
            try
            {
                return await comConfigService.SetPortConfig(model) > 0
                    ? Ok() 
                    : throw new Exception("Can not write port configuration");
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(4, nameof(SetPortConfig)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetDeviceConfig()
        {
            try
            {
                var result = await comConfigService.GetDeviceConfig();
                return Ok(mapper.Map<IComDeviceConfigView>(result));
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(5, nameof(GetDeviceConfig)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        [HttpPost]
        public async Task<IActionResult> SetDeviceConfig(ComDeviceConfigView model)
        {
            try
            {
                return await comConfigService.SetDeviceConfig(model) > 0
                    ? Ok() 
                    : throw new Exception("Can not write device configuration");
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(6, nameof(SetDeviceConfig)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetComLog(FilterModel<ComLog> filter)
        {
            try
            {
                var result = await Task.Run(() => comConfigService.GetComLog(filter));
                return Ok(mapper.Map<IComLogView>(result));
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(7, nameof(GetComLog)), e.Message);
                return await ExceptionResponse(e);
            }
        }

    }
}
