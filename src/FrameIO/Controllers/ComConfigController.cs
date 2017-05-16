using AutoMapper;
using FrameHelper;
using FrameIO.Data;
using FrameIO.Models;
using FrameIO.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FrameIO.Controllers
{
    [Authorize]
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
        public async Task<IActionResult> GetPortTypes()
        {
            try
            {
                var result = await comConfigService.GetPortTypes();
                logger.LogInformation("All Porttype is catched from resource!");
                return Ok(mapper.Map<IList<ComPortTypeView>>(result));
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(1, nameof(GetPortTypes)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        [HttpPost]
        public async Task<IActionResult> SetPortType(ComPortTypeView model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    logger.LogInformation("Try to save portype.");
                    return await comConfigService.SetPortType(model) > 0
                    ? Ok()
                    : throw new Exception("Can not write port type!");
                }

                logger.LogError($"Model is invalid!");
                return await ModelErrorResponse();
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(2, nameof(SetPortType)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetPortConfigs()
        {
            try
            {
                var result = await comConfigService.GetPortConfigs();
                logger.LogInformation("All Portconfig is catched from resource!");
                return Ok(mapper.Map<IList<ComPortConfigView>>(result));
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(3, nameof(GetPortConfigs)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        [HttpPost]
        public async Task<IActionResult> SetPortConfig(ComPortConfigView model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    logger.LogInformation("Try to save portconfig into resource.");
                    return await comConfigService.SetPortConfig(model) > 0
                        ? Ok()
                        : throw new Exception("Can not write port configuration!");
                }

                logger.LogError($"Model is invalid!");
                return await ModelErrorResponse();
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(4, nameof(SetPortConfig)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetDeviceConfigs()
        {
            try
            {
                var result = await comConfigService.GetDeviceConfigs();
                logger.LogInformation("All Deviceconfig is catched from resource.");
                return Ok(mapper.Map<IList<ComDeviceConfigView>>(result));
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(5, nameof(GetDeviceConfigs)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        [HttpPost]
        public async Task<IActionResult> SetDeviceConfig(ComDeviceConfigView model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    logger.LogInformation("Try to save deviceconfig into resource.");
                    return await comConfigService.SetDeviceConfig(model) > 0
                        ? Ok()
                        : throw new Exception("Can not write device configuration!");
                }

                logger.LogError($"Model is invalid!");
                return await ModelErrorResponse();
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(6, nameof(SetDeviceConfig)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetComLogs(FilterModel<ComLog> filter)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var result = await Task.Run(() => comConfigService.GetComLogs(filter));
                    logger.LogInformation("Query of logs are catched from resource.");
                    return Ok(mapper.Map<IList<ComLogView>>(result));
                }

                logger.LogError($"Model is invalid!");
                return await ModelErrorResponse();
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(7, nameof(GetComLogs)), e.Message);
                return await ExceptionResponse(e);
            }
        }

    }
}
