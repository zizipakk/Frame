using AutoMapper;
using FrameLog.Data;
using FrameLog.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrameLog.Services
{
    public interface ILogService
    {
        Task<IEnumerable<ILogDTO>> GetListByUserIdAsync(Guid userid);
        Task<ILogDTO> GetByIdAsync(Guid id);
        Task<int> SetAsync(ILogDTO log);
    }

    public class LogService : ILogService
    {
        private readonly ApplicationDbContext db;
        private readonly IMapper mapper;

        public LogService(ApplicationDbContext db, IMapper mapper)
        {
            this.db = db;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<ILogDTO>> GetListByUserIdAsync(Guid userid)
        {
            var result = await db.Logs
                            .Where(w => w.UserId == userid)
                            .ToListAsync();
            return mapper.Map<IEnumerable<ILogDTO>>(result);
        }

        public async Task<ILogDTO> GetByIdAsync(Guid id)
        {
            var res = await db.Logs.FindAsync(id);
            return mapper.Map<ILogDTO>(res);
        }

        public async Task<int> SetAsync(ILogDTO log)
        {
            db.Logs.Add(mapper.Map<Log>(log));
            return await db.SaveChangesAsync();
        }
    }
}
