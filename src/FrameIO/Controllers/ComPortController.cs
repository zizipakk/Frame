﻿using AutoMapper;
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
        
        /// TODO: poolozás helyett majd signalR push
        public async Task<IActionResult> Get(Guid userid)
        {
            try
            {
                return Ok(await Task.Run(() => comPortService.ReadPort()));
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
                var id = User?.Identity;
                model.UserId = (id as ClaimsIdentity)?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? id?.Name;
                model.Location = Request?.Host.Host;
                
                return await Task.Run(() => comPortService.WritePort(model)) 
                    ? Ok() 
                    : throw new Exception("Can not write COM port");
            }
            catch (Exception e)
            {
                logger.LogError(new EventId(2, nameof(Post)), e.Message);
                return await ExceptionResponse(e);
            }
        }
    }
}