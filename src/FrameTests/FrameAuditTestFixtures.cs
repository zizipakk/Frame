using AutoMapper;
using AutoMapper.Configuration;
using FrameAudit;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;

namespace FrameTests
{
    public class FrameAuditTestFixtures
    {
        // mapping for write log
        public class FakeMappingProfile : MapperConfigurationExpression, IDisposable
        {
            public FakeMappingProfile()
            {
                CreateMap<FakeEntity, FakeEntityLog>();
                CreateMap<FakeIdentity, FakeIdentityLog>();
                CreateMap<IdentityUserRole<string>, FakeUserRoleLog>();
            }

            public void Dispose()
            {
                Dispose();
            }
        }

#region audit

        // classes for test
        public class FakeEntity
        {
            public FakeEntity()
            {
                Id = Guid.NewGuid();
            }

            public Guid Id { get; set; }
            public string FakeProperty { get; set; }
        }

        public class FakeEntityLog : LogModelExtension
        {
            public string FakeProperty { get; set; }
        }

        public class FakeAuditContext : AuditDBContext
        {
            public static IEnumerable<EntityState> loggedStates = new List<EntityState> { EntityState.Added, EntityState.Deleted, EntityState.Modified };
            public static IEnumerable<Tuple<Type, Type>> loggedEntries =
                new List<Tuple<Type, Type>>
                {
                Tuple.Create(typeof(FakeEntity), typeof(FakeEntityLog)) // default(Type)
                };

            public FakeAuditContext(
                DbContextOptions<FakeAuditContext> options,
                IHttpContextAccessor context,
                IMapper mapper)
                : base(options, context, loggedStates, loggedEntries, mapper)
            {
            }

            public virtual DbSet<FakeEntity> FakeEntities { get; set; }
            public virtual DbSet<FakeEntityLog> FakeEntityLogs { get; set; }
        }



        // usage of auditcontext
        public class FrameAuditContextFixture : IDisposable
        {
            public readonly string userId = "Joci";

            public readonly List<FakeEntity> testList = new List<FakeEntity>
            {
                new FakeEntity { FakeProperty = "1" },
                new FakeEntity { FakeProperty = "2" },
                new FakeEntity { FakeProperty = "3" }
            };

            public DbContextOptionsBuilder optionsBuilder;

            public Mock<IHttpContextAccessor> contextMock;

            public IMapper mapper;

            public FakeAuditContext db;

            public FrameAuditContextFixture()
            {
                // Instead of mocking dbcontext, we use factory memory-instance
                optionsBuilder = new DbContextOptionsBuilder<FakeAuditContext>();
                optionsBuilder.UseInMemoryDatabase();
                contextMock = new Mock<IHttpContextAccessor>();
                contextMock.SetupGet(s => s.HttpContext.User.Identity.Name).Returns(userId);
                mapper = new Mapper(new MapperConfiguration(new FakeMappingProfile()));
                db = new FakeAuditContext(optionsBuilder.Options as DbContextOptions<FakeAuditContext>, contextMock.Object, mapper);
            }

            public void Clean()
            {
                if (db.FakeEntities.Any())
                    db.RemoveRange(db.FakeEntities);
                db.SaveChanges(); // This trigger logs again, so we must to save twice

                if (db.FakeEntityLogs.Any())
                    db.RemoveRange(db.FakeEntityLogs);
                if (db.AuditLogs.Any())
                    db.RemoveRange(db.AuditLogs);
                db.SaveChanges();
            }

            public void Dispose()
            {
                Clean();
                db.Dispose();
            }
        }

        #endregion

#region identity

        // classes for fake identity context
        public class FakeIdentity : IdentityUser
        {
            public FakeIdentity()
            {
                Id = Guid.NewGuid().ToString();
            }

            public string FakeProperty { get; set; }
        }

        public class FakeIdentityLog : LogModelExtension
        {
            public virtual ICollection<IdentityUserRole<string>> Roles { get; }
            public int AccessFailedCount { get; set; }
            public bool LockoutEnabled { get; set; }
            public DateTimeOffset? LockoutEnd { get; set; }
            public bool TwoFactorEnabled { get; set; }
            public bool PhoneNumberConfirmed { get; set; }
            public string PhoneNumber { get; set; }
            public string ConcurrencyStamp { get; set; }
            public string SecurityStamp { get; set; }
            public string PasswordHash { get; set; }
            public bool EmailConfirmed { get; set; }
            public string NormalizedEmail { get; set; }
            public string Email { get; set; }
            public string NormalizedUserName { get; set; }
            public string UserName { get; set; }
            public string Id { get; set; }

            public string FakeProperty { get; set; }
        }

        public class FakeIdentityRole : IdentityRole
        {
            public FakeIdentityRole()
            {
                Id = Guid.NewGuid().ToString();
            }

            public string FakeProperty { get; set; }
        }

        public class FakeUserRoleLog : LogModelExtension
        {
            public string UserId { get; set; }
            public string RoleId { get; set; }
        }

        public class FakeIdentityContext : AuditDBContextWithIdentity<IdentityUser>
        {
            private static IEnumerable<EntityState> loggedStates = new List<EntityState> { EntityState.Added, EntityState.Deleted, EntityState.Modified };
            private static IEnumerable<Tuple<Type, Type>> loggedEntries =
                new List<Tuple<Type, Type>>
                {
                    Tuple.Create(typeof(FakeIdentity), typeof(FakeIdentityLog)) // default(Type)
                };

            public FakeIdentityContext(
                DbContextOptions<FakeIdentityContext> options,
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

            public virtual DbSet<FakeIdentity> FakeIdentities { get; set; }
            public virtual DbSet<FakeIdentityLog> FakeIdentityLogs { get; set; }
            public virtual DbSet<FakeIdentityRole> FakeIdentityRoles { get; set; } 
            public virtual DbSet<FakeUserRoleLog> FakeUserRoleLogs { get; set; }
            public virtual DbSet<IdentityUserRole<string>> IdentityUserRoles { get; set; }
            
        }

        /// <summary>
        /// Usage for identity context
        /// </summary>
        public class FrameAuditWidthIdentityContextFixture : IDisposable
        {
            public readonly string userId = "Joci";

            public readonly List<FakeIdentity> testList = new List<FakeIdentity>
            {                
                new FakeIdentity
                {
                    AccessFailedCount = 0,
                    LockoutEnabled = true,
                    TwoFactorEnabled = true,
                    PhoneNumberConfirmed = false,
                    EmailConfirmed = false,
                    FakeProperty = "1"
                },
                new FakeIdentity
                {
                    AccessFailedCount = 0,
                    LockoutEnabled = true,
                    TwoFactorEnabled = true,
                    PhoneNumberConfirmed = false,
                    EmailConfirmed = false,
                    FakeProperty = "2"
                },
                new FakeIdentity
                {
                    AccessFailedCount = 0,
                    LockoutEnabled = true,
                    TwoFactorEnabled = true,
                    PhoneNumberConfirmed = false,
                    EmailConfirmed = false,
                    FakeProperty = "3"
                },
            };

            public DbContextOptionsBuilder optionsBuilder;

            public Mock<IHttpContextAccessor> contextMock;

            public IMapper mapper;

            public FakeIdentityContext db;

            public FrameAuditWidthIdentityContextFixture()
            {
                // Instead of mocking dbcontext, we use factory memory-instance
                optionsBuilder = new DbContextOptionsBuilder<FakeIdentityContext>();
                optionsBuilder.UseInMemoryDatabase();
                contextMock = new Mock<IHttpContextAccessor>();
                contextMock.SetupGet(s => s.HttpContext.User.Identity.Name).Returns(userId);
                mapper = new Mapper(new MapperConfiguration(new FakeMappingProfile()));
                db = new FakeIdentityContext(
                    optionsBuilder.Options as DbContextOptions<FakeIdentityContext>,
                    contextMock.Object,
                    mapper);
            }

            public void Clean()
            {
                if (db.IdentityUserRoles.Any())
                    db.RemoveRange(db.IdentityUserRoles);
                if (db.FakeIdentityRoles.Any())
                    db.RemoveRange(db.FakeIdentityRoles);
                if (db.FakeIdentities.Any())
                    db.RemoveRange(db.FakeIdentities);
                db.SaveChanges(); // This trigger logs again, so we must to save twice

                if (db.FakeUserRoleLogs.Any())
                    db.RemoveRange(db.FakeUserRoleLogs);
                if (db.FakeIdentityLogs.Any())
                    db.RemoveRange(db.FakeIdentityLogs);
                if (db.AuditLogs.Any())
                    db.RemoveRange(db.AuditLogs);
                db.SaveChanges();

                // back to the defaults
                db.common.loggedEntries =
                    new List<Tuple<Type, Type>>
                    {
                        Tuple.Create(typeof(FakeIdentity), typeof(FakeIdentityLog))
                    };
                db.common.loggedStates = new List<EntityState> { EntityState.Added, EntityState.Deleted, EntityState.Modified };
            }

            public void Dispose()
            {
                Clean();
                db.Dispose();
            }
        }

#endregion

    }
}
