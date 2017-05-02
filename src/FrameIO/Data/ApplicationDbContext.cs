using AutoMapper;
using FrameAudit;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace FrameIO.Data
{
    public class ApplicationDbContext : AuditDBContext
    {
        private static IEnumerable<EntityState> loggedStates = new List<EntityState> { EntityState.Added, EntityState.Deleted, EntityState.Modified };
        private static IEnumerable<(Type, Type)> loggedEntries = 
            new List<(Type, Type)>
            {
                (typeof(ComPortType), typeof(ComPortTypeLog)),
                (typeof(ComPortConfig), typeof(ComPortConfigLog)),
                (typeof(ComDeviceConfig), typeof(ComDeviceConfigLog))
            };

        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options,
            IHttpContextAccessor context,
            IMapper mapper)
                : base(options,
                      context,
                      loggedStates,
                      loggedEntries,
                      mapper)
        {}

        public virtual DbSet<ComPortType> ComPortTypes { get; set; }
        public virtual DbSet<ComPortTypeLog> ComPortTypeLogs { get; set; }
        public virtual DbSet<ComPortConfig> ComPortConfigs { get; set; }
        public virtual DbSet<ComPortConfigLog> ComPortConfigLogs { get; set; }
        public virtual DbSet<ComDeviceConfig> ComDeviceConfigs { get; set; }
        public virtual DbSet<ComDeviceConfigLog> ComDeviceConfigLogs { get; set; }
        public virtual DbSet<ComLog> ComLogs { get; set; }

        //protected override void OnModelCreating(ModelBuilder builder)
        //{
        //    base.OnModelCreating(builder);
        //    // Customize the ASP.NET Identity model and override the defaults if needed.
        //    // For example, you can rename the ASP.NET Identity table names and more.
        //    // Add your customizations after calling base.OnModelCreating(builder);
        //}

    }
}
