using AutoMapper;
using FrameHelper;
using FrameIO.Models;
using FrameIO.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace FrameIO.Controllers
{
    [Authorize]
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
        
        /// TODO: poolozás helyett majd signalR push
        public async Task<IActionResult> Get(Guid userid)
        {
            try
            {
            
                if (ModelState.IsValid)
                {
                    logger.LogInformation("Try to read port.");
                    return Ok(await Task.Run(() => comPortService.ReadPort()));
                }

                logger.LogError($"Model is invalid!");
                return await ModelErrorResponse();
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(1, nameof(Get)), e.Message);
                return await ExceptionResponse(e);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]ComLogView model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var id = User?.Identity;
                    model.UserId = (id as ClaimsIdentity)?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? id?.Name;
                    logger.LogInformation("Get userinfo from Id.");
                    model.Location = Request?.Host.Host;

                    logger.LogInformation("Try to write port with userid and location info.");
                    return await Task.Run(() => comPortService.WritePort(model))
                        ? Ok()
                        : throw new Exception("Can not write COM port");
                }

                logger.LogError($"Model is invalid!");
                return await ModelErrorResponse();
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(2, nameof(Post)), e.Message);
                return await ExceptionResponse(e);
            }
        }
    }
}
