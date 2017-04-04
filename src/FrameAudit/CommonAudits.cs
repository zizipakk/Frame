using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using AutoMapper;

namespace FrameAudit
{
    public interface ICommonAudits
    {
        void RevertChanges(IEnumerable<EntityEntry> allEntries);

        void Logger(string action, DbContext dbContext);
    }

    public class CommonAudits : ICommonAudits
    {
        private readonly IHttpContextAccessor context;
        private readonly IEnumerable<EntityState> loggedStates;
        private readonly IEnumerable<Tuple<EntityEntry, EntityEntry>> loggedEntries;
        private readonly IMapper mapper;

        public CommonAudits(
            IHttpContextAccessor context,
            IEnumerable<EntityState> loggedStates,
            IEnumerable<Tuple<EntityEntry, EntityEntry>> loggedEntries,
            IMapper mapper
        )
        {
            this.context = context;
            this.loggedStates = loggedStates.Distinct();
            this.loggedEntries = loggedEntries.Distinct();
            this.mapper = mapper;
        }

        /// <summary>
        /// Restore changetracker if exception
        /// </summary>
        public void RevertChanges(IEnumerable<EntityEntry> allEntries)
        {
            allEntries.ToList().ForEach(entry =>
            {
                switch (entry.State)
                {
                    case EntityState.Modified:
                        entry.CurrentValues.SetValues(entry.OriginalValues);
                        entry.State = EntityState.Unchanged;
                        break;
                    case EntityState.Deleted:
                        entry.State = EntityState.Unchanged;
                        break;
                    case EntityState.Added:
                        entry.State = EntityState.Detached;
                        break;
                }
            });
        }

        /// <summary>
        /// Save sync auditlogs and shadow logs in one step
        /// </summary>
        /// <returns></returns>
        public void Logger(string action, DbContext dbContext)
        {
            var allChangedEntries = dbContext.ChangeTracker.Entries();

            if (allChangedEntries.Any() && loggedStates.Any() && loggedEntries.Any())
            {

                try
                {
                    var filteredChangedEntries = allChangedEntries
                        .Where(w => loggedStates.Contains(w.State) && loggedEntries.Select(s => s.Item1).Contains(w));

                    if (filteredChangedEntries.Any())
                    {
                        // freez tracker like bulk insert
                        dbContext.ChangeTracker.AutoDetectChangesEnabled = false;

                        var id = context.HttpContext?.User?.Identity;
                        // By sing necessary put userID into claims
                        var userId = (id as ClaimsIdentityOptions)?.UserIdClaimType ?? id?.Name;
                        var location = context.HttpContext?.Request?.Host.Host;

                        // audit
                        dbContext.AddRange(
                            filteredChangedEntries
                            .Select(s =>
                                new AuditLog(userId, s.Entity.GetType().Name, location)
                                {
                                    State = s.State.ToString(),
                                    Action = action
                                }));

                        // shadow
                        loggedEntries
                            .Where(w => w.Item2 != null)
                            .Select(s => s.Item2.Entity)
                            .Distinct()
                            .ToList()
                            .ForEach(shadowEntityFilter =>
                                {
                                    var entityType = shadowEntityFilter.GetType();
                                    dbContext.AddRange(
                                        filteredChangedEntries
                                            .SelectMany(e => loggedEntries.Where(w => w.Item1.Entity == e.Entity && w.Item2.Entity == shadowEntityFilter),
                                                (e, s) => mapper.Map(s.Item1.Entity, Activator.CreateInstance(entityType))
                                            ));
                                });

                        // back to normal operation
                        dbContext.ChangeTracker.AutoDetectChangesEnabled = true;
                    }
                }
                catch (Exception e)
                {
                    RevertChanges(allChangedEntries);
                    throw new Exception(e.Message);
                }
            }
        }
    }
}