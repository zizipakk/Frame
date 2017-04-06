using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Http;
using AutoMapper;

namespace FrameAudit
{
    public class AuditDBContext : DbContext
    {
        public ICommonAudits common;

        public AuditDBContext(
            DbContextOptions options,
            IHttpContextAccessor context,
            IEnumerable<EntityState> loggedStates,
            IEnumerable<Tuple<Type, Type>> loggedEntries,
            IMapper mapper
        ) : base(options)
        {
            this.common = new CommonAudits(context, loggedStates, loggedEntries, mapper); //TODO: Zero DI conf
        }

        /// <summary>
        /// This is for common audits
        /// </summary>
        public virtual DbSet<AuditLog> AuditLogs { get; set; }

        /// <summary>
        /// Override async save
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public Task<int> SaveChangesAsync([CallerMemberName]string action = "")
        {
            common.Logger(action, this as DbContext);
            return base.SaveChangesAsync();
        }

        /// <summary>
        /// Override sync save
        /// </summary>
        /// <returns></returns>
        public int SaveChanges([CallerMemberName]string action = "")
        {
            common.Logger(action, this as DbContext);
            return base.SaveChanges();
        }
    }
}