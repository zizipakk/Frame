using FrameLog.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrameLog.Repositories
{
    public interface ILogRepository
    {
        Task<IEnumerable<Log>> GetListByUserIdAsync(Guid userid);
        Task<Log> GetByIdAsync(Guid id);
        Task<int> SetAsync(Log log);
    }

    public class LogRepository : ILogRepository
    {
        private readonly ApplicationDbContext db;

        public LogRepository(ApplicationDbContext db)
        {
            this.db = db;
        }

        public async Task<IEnumerable<Log>> GetListByUserIdAsync(Guid userid)
        {
            return await db.Logs
                            .Where(w => w.UserId == userid)
                            .ToListAsync();
        }

        public async Task<Log> GetByIdAsync(Guid id)
        {
            return await db.Logs.FindAsync(id);
        }

        public async Task<int> SetAsync(Log log)
        {
            db.Logs.Add(log);
            return await db.SaveChangesAsync();
        }

    }
}
