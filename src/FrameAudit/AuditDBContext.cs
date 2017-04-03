using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Http;
using System.Threading;

namespace FrameAudit
{
    public class AuditDBContext : DbContext
    {
        private string action = ""; //TODO thread safe?
        private readonly ICommonAudits common;

        public AuditDBContext(
            DbContextOptions options,
            IHttpContextAccessor context,
            IEnumerable<EntityState> loggedStates,
            IEnumerable<Tuple<EntityEntry, EntityEntry>> loggedEntries
        ) : base(options)
        {
            this.common = new CommonAudits(context, loggedStates, loggedEntries); //TODO: Zero DI conf
        }

        /// <summary>
        /// This is for common audits
        /// </summary>
        public virtual DbSet<AuditLog> AuditLogs { get; set; }

        /// <summary>
        /// Proxy to get caller
        /// </summary>
        /// <param name="action"></param>
        /// <returns></returns>
        public Task<int> SaveChangesAsync([CallerMemberName]string action = "")
        {
            this.action = action;
            return SaveChangesAsync();
        }

        /// <summary>
        /// Override async save
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            common.Logger(action, this as DbContext);
            return base.SaveChangesAsync();
        }

        /// <summary>
        /// Proxy to get caller
        /// </summary>
        /// <param name="action"></param>
        /// <returns></returns>
        public int SaveChanges([CallerMemberName]string action = "")
        {
            this.action = action;
            return SaveChanges();
        }

        /// <summary>
        /// Override sync save
        /// </summary>
        /// <returns></returns>
        public override int SaveChanges()
        {
            common.Logger(action, this as DbContext);
            return base.SaveChanges();
        }
    }
}