using AutoMapper;
using AutoMapper.Configuration;
using FrameAudit;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
//using Microsoft.VisualStudio.TestTools.UnitTesting;
using Xunit;

namespace FrameTests
{
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

    public class FakeMappingProfile : MapperConfigurationExpression //Profile
    {
        public FakeMappingProfile()
        {
            CreateMap<FakeEntity, FakeEntityLog>();
        }
    }

    public class FakeContext : AuditDBContext
    {
        public static IEnumerable<EntityState> loggedStates = new List<EntityState> { EntityState.Added, EntityState.Deleted, EntityState.Modified };
        public static IEnumerable<Tuple<Type, Type>> loggedEntries =
            new List<Tuple<Type, Type>>
            {
                Tuple.Create(typeof(FakeEntity), typeof(FakeEntityLog)) // default(Type)
            };

        public FakeContext(
            DbContextOptions<FakeContext> options, 
            IHttpContextAccessor context, 
            AutoMapper.IMapper mapper) 
            : base(options, context, loggedStates, loggedEntries, mapper)
        {
        }

        public virtual DbSet<FakeEntity> FakeEntities { get; set; }
        public virtual DbSet<FakeEntityLog> FakeEntityLogs { get; set; }
    }

    //[TestClass]
    public class FrameAuditTests
    {
        //[TestInitialize]
        //public void MsTestInit()
        //{}

        //[TestMethod]
        //public void MsTestMethod()
        //{}

        //[TestCleanup]
        //public void MsTestFinalize()
        //{}

        [Fact]
        public void TestAuditAndLogAsync()
        {
            var userId = "Joci";
            // Instead of mocking dbcontext, we use factory memory-instance
            var optionsBuilder = new DbContextOptionsBuilder<FakeContext>();
            optionsBuilder.UseInMemoryDatabase();
            var contextMock = new Mock<IHttpContextAccessor>();
            contextMock.SetupGet(s => s.HttpContext.User.Identity.Name).Returns(userId);
            var mapper = new Mapper(new MapperConfiguration(new FakeMappingProfile()));
            var db = new FakeContext(optionsBuilder.Options, contextMock.Object, mapper);

            var testList = new List<FakeEntity>
            {
                new FakeEntity { FakeProperty = "1" },
                new FakeEntity { FakeProperty = "2" },
                new FakeEntity { FakeProperty = "3" }
            };

            db.AddRangeAsync(testList);

            db.SaveChangesAsync();

            var resultEntities = db.FakeEntities.ToListAsync();
            var resultAudits = db.AuditLogs.ToListAsync();
            var resultLogs = db.FakeEntityLogs.ToListAsync();

            Assert.Equal(testList.Count(), resultAudits.Result.Where(w => w.CreatorId == userId).Count());
            Assert.Equal(testList.Count(), resultLogs.Result.Where(w => w.ExecutiveId == userId).Count());
        }
    }
}
