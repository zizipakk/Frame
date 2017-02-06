using AutoMapper;
using FrameLog.Data;
using FrameLog.Models;
using FrameLog.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FrameLog.Services
{
    public interface ILogService
    {
        Task<IEnumerable<ILogDTO>> GetListByUserIdAsync(Guid userid);
        ILogDTO GetByIdAsync(Guid id);
        Task<int> SetAsync(ILogDTO log);
    }

    class LogService : ILogService
    {
        private readonly ILogRepository repo;
        private readonly IMapper mapper;

        LogService(ILogRepository repo, IMapper mapper)
        {
            this.repo = repo;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<ILogDTO>> GetListByUserIdAsync(Guid userid)
        {
            var result = await repo.GetListByUserIdAsync(userid);
            return mapper.Map<IEnumerable<ILogDTO>>(result);
        }

        public ILogDTO GetByIdAsync(Guid id)
        {
            return mapper.Map<ILogDTO>(repo.GetByIdAsync(id));
        }

        public async Task<int> SetAsync(ILogDTO log)
        {
            var model = mapper.Map<Log>(log);
            return await repo.SetAsync(model);
        }
    }
}
