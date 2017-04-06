using AutoMapper;
using FrameAudit;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace FrameAuth.Data
{
    public class ApplicationDbContext : AuditDBContextWithIdentity<ApplicationUser>
    {
        private static IEnumerable<EntityState> loggedStates = new List<EntityState> { EntityState.Added, EntityState.Deleted, EntityState.Modified };
        private static IEnumerable<Tuple<Type, Type>> loggedEntries =
            new List<Tuple<Type, Type>>
            {
                    Tuple.Create(typeof(ApplicationUser), typeof(ApplicationUserLog)) // default(Type)
            };

        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options,
            IHttpContextAccessor context,
            IMapper mapper)
                : base(
                      options,
                      context,
                      loggedStates,
                      loggedEntries,
                      mapper)
            {
        }

        public virtual DbSet<ApplicationUserLog> ApplicationUserLogs { get; set; }

        //protected override void OnModelCreating(ModelBuilder builder)
        //{
        //    base.OnModelCreating(builder);
        //    // Customize the ASP.NET Identity model and override the defaults if needed.
        //    // For example, you can rename the ASP.NET Identity table names and more.
        //    // Add your customizations after calling base.OnModelCreating(builder);
        //}

    }
}
