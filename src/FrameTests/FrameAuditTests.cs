using FrameAudit;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
//using Microsoft.VisualStudio.TestTools.UnitTesting;
using Xunit;

namespace FrameTests
{
    public class FakeEntity
    {
        public string FakeProperty { get; set; }
    }

    public class FakeContext : AuditDBContext
    {
        public FakeContext(
            DbContextOptions options, 
            IHttpContextAccessor context, 
            IEnumerable<EntityState> loggedStates, 
            IEnumerable<Tuple<Microsoft.EntityFrameworkCore.ChangeTracking.EntityEntry, Microsoft.EntityFrameworkCore.ChangeTracking.EntityEntry>> loggedEntries, 
            AutoMapper.IMapper mapper) 
            : base(options, context, loggedStates, loggedEntries, mapper)
        {
        }

        public virtual DbSet<FakeEntity> FakeEntities { get; set; }
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
        public void Test2()
        {

        }
    }
}
