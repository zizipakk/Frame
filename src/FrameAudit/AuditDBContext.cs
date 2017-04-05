using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Http;
using System.Threading;
using AutoMapper;

namespace FrameAudit
{
    public class AuditDBContext : DbContext
    {
        private readonly ICommonAudits common;

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

        ///// <summary>
        ///// Proxy to get caller
        ///// </summary>
        ///// <param name="action"></param>
        ///// <returns></returns>
        //public Task<int> SaveChangesAsync([CallerMemberName]string action = "")
        //{
        //    this.action = action;
        //    return base.SaveChangesAsync();
        //}

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