using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Collections;
using Microsoft.EntityFrameworkCore.Infrastructure;
using System.Threading;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using System.Reflection;

namespace FrameAudit
{
    /// <summary>
    /// This for elastic usage
    /// BUT DEPENDENT ON EF.Core 1.1
    /// </summary>
    public interface IChangeTracker : IInfrastructure<IStateManager>
    {
        bool AutoDetectChangesEnabled { get; set; }
        IDbContext Context { get; }
        QueryTrackingBehavior QueryTrackingBehavior { get; set; }
        void AcceptAllChanges();
        void DetectChanges();
        IEnumerable<EntityEntry> Entries();
        IEnumerable<EntityEntry<TEntity>> Entries<TEntity>() where TEntity : class;
        bool HasChanges();
        void TrackGraph(object rootEntity, Action<EntityEntryGraphNode> callback);
    }

    /// <summary>
    /// This for elastic usage
    /// BUT DEPENDENT ON EF.Core 1.1
    /// </summary>
    public interface IDbContext : IDisposable, IInfrastructure<IServiceProvider>
    {
        ChangeTracker ChangeTracker { get; }
        DatabaseFacade Database { get; }
        IModel Model { get; }

        EntityEntry Add(object entity);
        EntityEntry<TEntity> Add<TEntity>(TEntity entity) where TEntity : class;
        Task<EntityEntry> AddAsync(object entity, CancellationToken cancellationToken = default(CancellationToken));
        Task<EntityEntry<TEntity>> AddAsync<TEntity>(TEntity entity, CancellationToken cancellationToken = default(CancellationToken)) where TEntity : class;
        void AddRange(IEnumerable<object> entities);
        void AddRange(params object[] entities);
        Task AddRangeAsync(params object[] entities);
        Task AddRangeAsync(IEnumerable<object> entities, CancellationToken cancellationToken = default(CancellationToken));
        EntityEntry Attach(object entity);
        EntityEntry<TEntity> Attach<TEntity>(TEntity entity) where TEntity : class;
        void AttachRange(IEnumerable<object> entities);
        void AttachRange(params object[] entities);
        void Dispose();
        EntityEntry Entry(object entity);
        EntityEntry<TEntity> Entry<TEntity>(TEntity entity) where TEntity : class;
        object Find(Type entityType, params object[] keyValues);
        TEntity Find<TEntity>(params object[] keyValues) where TEntity : class;
        Task<object> FindAsync(Type entityType, params object[] keyValues);
        Task<object> FindAsync(Type entityType, object[] keyValues, CancellationToken cancellationToken);
        Task<TEntity> FindAsync<TEntity>(params object[] keyValues) where TEntity : class;
        Task<TEntity> FindAsync<TEntity>(object[] keyValues, CancellationToken cancellationToken) where TEntity : class;
        EntityEntry Remove(object entity);
        EntityEntry<TEntity> Remove<TEntity>(TEntity entity) where TEntity : class;
        void RemoveRange(IEnumerable<object> entities);
        void RemoveRange(params object[] entities);        
        int SaveChanges();
        int SaveChanges(bool acceptAllChangesOnSuccess);
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken));
        Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default(CancellationToken));
        DbSet<TEntity> Set<TEntity>() where TEntity : class;
        EntityEntry Update(object entity);
        EntityEntry<TEntity> Update<TEntity>(TEntity entity) where TEntity : class;
        void UpdateRange(params object[] entities);
        void UpdateRange(IEnumerable<object> entities);
        void OnConfiguring(DbContextOptionsBuilder optionsBuilder);
        void OnModelCreating(ModelBuilder modelBuilder);
    }

    public partial class AuditDBContext : DbContext
    {
        private readonly IEnumerable<EntityState> loggedStates;
        private readonly IEnumerable<Tuple<EntityEntry, EntityEntry>> loggedEntries;
        private readonly DbContext context;

        public AuditDBContext(
            DbContextOptions<AuditDBContext> options,
            IEnumerable<EntityState> loggedStates,
            IEnumerable<Tuple<EntityEntry, EntityEntry>> loggedEntityTypes
            ) : base(options)
        {
            this.loggedStates = loggedStates;
            this.loggedEntries = loggedEntityTypes;

            if (GetType().GetTypeInfo().IsSubclassOf(typeof(DbContext)))
            {
                context = ; //.GetProperty("ChangeTracker") ?? new DbContext(null);
            }
            else
            {
                context = new DbContext(options);
            }
        }

        /// <summary>
        /// This is for common auditsy
        /// </summary>
        internal virtual DbSet<AuditLog> AuditLogs { get; set; }

        /// <summary>
        /// Cleaning changetracker if exception
        /// </summary>
        public virtual void RevertChanges()
        {
            foreach (var entry in context.ChangeTracker.Entries())
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
            }
        }

        /// <summary>
        /// Save auditlogs  and logs in one step
        /// </summary>
        /// <param name="executiveID"></param>
        /// <returns></returns>
        public async virtual Task<int> SaveChangesAsync(Guid? executiveID, string location = null)
        {
            var result = 0;

            try
            {
                // freez tracker like bulk insert
                context.ChangeTracker.AutoDetectChangesEnabled = false;

                //Create changed entries list with logtypes if exists
                var entries = context.ChangeTracker
                                .Entries()
                                .Where(w => loggedStates.Contains(w.State))
                                .SelectMany(
                                    e => loggedEntries.Where(w => w.Item1 == e),
                                    (e, l) => new { entry = e, shadowEntry = l.Item2 })
                                .OrderBy(o => o.shadowEntry.Entity?.GetType()?.Name);

                if (entries.Any())
                {
                    var newAudits = new List<AuditLog>();
                    newAudits.AddRange(
                                    entries
                                        .Select(s => new AuditLog(executiveID, s.entry.Entity.GetType().Name, location)
                                        {
                                            State = s.entry.State.ToString(),
                                            Action = "auto", // caller from stack
                                            Location = ""
                                        })
                                );
                    await context.AddRangeAsync(newAudits); //TODO one step

                    entries
                        .Where(w => w.shadowEntry != null)
                        .Select(s => s.shadowEntry)
                        .Distinct()
                        .ToList()
                        .ForEach(shadowEntryFilter =>
                        {
                        var entityType = shadowEntryFilter.Entity.GetType();
                        var newShadowEntities = (IList)Activator.CreateInstance(typeof(List<>).MakeGenericType(entityType));
                        entries
                            .Where(w => w.shadowEntry == shadowEntryFilter)
                            .Select(s => s.shadowEntry)
                            .ToList()
                            .ForEach(shadowEntry =>
                            {
                                newShadowEntities.Add(shadowEntry.Entity);
                            });

                            context.AddRangeAsync(newShadowEntities);
                        });
                }


                result = await context.SaveChangesAsync();
                // back to normal operation
                context.ChangeTracker.AutoDetectChangesEnabled = true;
            }
            catch (Exception e)
            {
                RevertChanges();
                throw new Exception(e.Message);
            }

            return result;
        }
    }
}