using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.AspNetCore.Http;
using AutoMapper;
using System.Reflection;
using System.Security.Claims;

namespace FrameAudit
{
    public interface ICommonAudits
    {
        IEnumerable<EntityState> loggedStates { get; set; }
        IEnumerable<(Type, Type)> loggedEntries { get; set; }
        void RevertChanges(IEnumerable<EntityEntry> allEntries);
        void Logger(string action, DbContext dbContext);
    }

    public class CommonAudits : ICommonAudits
    {
        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;
        public IEnumerable<EntityState> loggedStates { get; set; } // reconfigurable
        public IEnumerable<(Type, Type)> loggedEntries { get; set; } // reconfigurable

        public CommonAudits(
            IHttpContextAccessor httpContext,
            IEnumerable<EntityState> loggedStates,
            IEnumerable<(Type, Type)> loggedEntries,
            IMapper mapper
        )
        {
            this.httpContext = httpContext;
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

            if (
                allChangedEntries.Any() 
                && loggedStates != null && loggedStates.Any() 
                && loggedEntries != null && loggedEntries.Any())
            {

                try
                {
                    var filteredChangedEntries = allChangedEntries
                        .Where(w => loggedStates.Contains(w.State) && loggedEntries.Select(s => s.Item1).Contains(w.Entity.GetType()));

                    if (filteredChangedEntries.Any())
                    {
                        // freez tracker like bulk insert
                        dbContext.ChangeTracker.AutoDetectChangesEnabled = false;

                        var id = httpContext.HttpContext?.User?.Identity;
                        // By sign necessary put userID into claims
                        var userId = (id as ClaimsIdentity)?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? id?.Name;
                        var location = httpContext.HttpContext?.Request?.Host.Host;

                        // audit
                        dbContext.AddRange(
                            filteredChangedEntries
                            .Select(s =>
                                new AuditLog(userId, s.Entity.GetType()?.Name, location)
                                {
                                    EntityId = s.Entity.GetType()?.GetProperty(s.Metadata.FindPrimaryKey().Properties.Select(se => se.Name).FirstOrDefault())?.GetValue(s.Entity, null).ToString(),
                                    State = s.State.ToString(),
                                    Action = action
                                })
                            .ToList());

                        // shadow
                        loggedEntries
                            .Where(w => w.Item2 != null)
                            .Select(s => s.Item2)
                            .Distinct()
                            .ToList()
                            .ForEach(shadowEntityType =>
                                {
                                    var shadowList =
                                        filteredChangedEntries
                                            .SelectMany(e => loggedEntries.Where(w => w.Item1 == e.Entity.GetType() && w.Item2 == shadowEntityType),
                                                (e, s) => mapper.Map(e.Entity, Activator.CreateInstance(shadowEntityType)))
                                            .ToList();
                                    shadowList
                                        .ForEach(item =>
                                            {
                                                item.GetType()?.GetProperty(nameof(LogModelExtension.ExecutiveId))?.SetValue(item, userId);
                                            });

                                    dbContext.AddRange(shadowList);

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