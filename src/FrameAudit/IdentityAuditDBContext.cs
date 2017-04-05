using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Http;
using System.Threading;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using AutoMapper;

namespace FrameAudit
{
    public class AuditDBContextWithIdentity<TUser> : IdentityDbContext<TUser> where TUser : IdentityUser
    {
        private readonly ICommonAudits common;

        public AuditDBContextWithIdentity(
            DbContextOptions options,
            IHttpContextAccessor context,
            IEnumerable<EntityState> loggedStates,
            IEnumerable<Tuple<Type, Type>> loggedEntries,
            IMapper mapper
        ) : base(options)
        {
            this.common = new CommonAudits(context, loggedStates, loggedEntries, mapper); //TODO: or DI constructor arguments
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