﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using AutoMapper;
using System.Threading;
using System.Diagnostics;

namespace FrameAudit
{
    public class AuditDBContextWithIdentity<TUser> : IdentityDbContext<TUser> where TUser : IdentityUser
    {        
        public ICommonAudits common;

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
        /// Overload async save
        /// </summary>
        /// <param name="action"></param>
        /// <returns></returns>
        public Task<int> SaveChangesAsync([CallerMemberName]string action = "")
        {
            common.Logger(action, this as DbContext);
            return base.SaveChangesAsync();
        }

        /// <summary>
        /// Override async save
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            common.Logger("internal", this as DbContext);
            return base.SaveChangesAsync();
        }

        /// <summary>
        /// Overload sync save
        /// </summary>
        /// <param name="action"></param>
        /// <returns></returns>
        public int SaveChanges([CallerMemberName]string action = "")
        {
            common.Logger(action, this as DbContext);
            return base.SaveChanges();
        }

        /// <summary>
        /// Override sync save
        /// </summary>
        /// <returns></returns>
        public override int SaveChanges()
        {
            //var stackTrace = new StackTrace(new Exception(), true);
            //var action = stackTrace?.GetFrames()?.Length > 0 ? stackTrace?.GetFrames()[1]?.GetMethod()?.Name : "internal";
            common.Logger("internal", this as DbContext);
            return base.SaveChanges();
        }
    }
}