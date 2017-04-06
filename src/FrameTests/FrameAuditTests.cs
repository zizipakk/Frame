using Microsoft.EntityFrameworkCore;
using System.Linq;
using Xunit;
using static FrameTests.FrameAuditTestFixtures;

namespace FrameTests
{
    public class FrameAuditTests : IClassFixture<FrameAuditContextFixture>
    {
        FrameAuditContextFixture fixture;
        int testCount;

        public FrameAuditTests(FrameAuditContextFixture fixture)
        {
            this.fixture = fixture;
            testCount = fixture.testList.Count();
        }

        [Fact]
        public async void TestAuditAndLogAsync()
        {
            await fixture.db.AddRangeAsync(fixture.testList);
            var count = await fixture.db.SaveChangesAsync();

            // insert assertion
            Assert.Equal(count, 9);
            Assert.Equal(testCount, fixture.db.FakeEntities.SelectMany(s => fixture.testList.Where(w => w.FakeProperty == s.FakeProperty)).Count());
            Assert.Equal(testCount, fixture.db.AuditLogs.Where(w => w.CreatorId == fixture.userId).Count());
            Assert.Equal(testCount, fixture.db.AuditLogs.Where(w => w.State == EntityState.Added.ToString()).Count());
            Assert.Equal(testCount, fixture.db.FakeEntityLogs.Where(w => w.ExecutiveId == fixture.userId).Count());

            // modify
            fixture.db.FakeEntities.ToList().ForEach(f => f.FakeProperty = $"1{f.FakeProperty}"); // FakeEntiites attached to testList, so both changed
            fixture.db.UpdateRange(fixture.db.FakeEntities);
            count = await fixture.db.SaveChangesAsync();

            // modify assertion
            Assert.Equal(count, 9);
            Assert.Equal(testCount, fixture.db.FakeEntities.SelectMany(s => fixture.testList.Where(w => w.FakeProperty == s.FakeProperty)).Count());
            Assert.Equal(2 * testCount, fixture.db.AuditLogs.Where(w => w.CreatorId == fixture.userId).Count());
            Assert.Equal(testCount, fixture.db.AuditLogs.Where(w => w.State == EntityState.Modified.ToString()).Count());
            Assert.Equal(2 * testCount, fixture.db.FakeEntityLogs.Where(w => w.ExecutiveId == fixture.userId).Count());

            // delete
            fixture.db.RemoveRange(fixture.db.FakeEntities);
            count = await fixture.db.SaveChangesAsync();

            // delete assertion
            Assert.Equal(count, 9);
            Assert.Equal(fixture.db.FakeEntities.Count(), 0);
            Assert.Equal(3 * testCount, fixture.db.AuditLogs.Where(w => w.CreatorId == fixture.userId).Count());
            Assert.Equal(testCount, fixture.db.AuditLogs.Where(w => w.State == EntityState.Deleted.ToString()).Count());
            Assert.Equal(3 * testCount, fixture.db.FakeEntityLogs.Where(w => w.ExecutiveId == fixture.userId).Count());

            fixture.Clean();
        }

        [Fact]
        public void TestAuditAndLog()
        {
            // insert
            fixture.db.AddRange(fixture.testList);
            var count = fixture.db.SaveChanges();

            // insert assertion
            Assert.Equal(count, 9);
            Assert.Equal(testCount, fixture.db.FakeEntities.SelectMany(s => fixture.testList.Where(w => w.FakeProperty == s.FakeProperty)).Count());
            Assert.Equal(testCount, fixture.db.AuditLogs.Where(w => w.CreatorId == fixture.userId).Count());
            Assert.Equal(testCount, fixture.db.AuditLogs.Where(w => w.State == EntityState.Added.ToString()).Count());
            Assert.Equal(testCount, fixture.db.FakeEntityLogs.Where(w => w.ExecutiveId == fixture.userId).Count());

            // modify
            fixture.db.FakeEntities.ToList().ForEach(f => f.FakeProperty = $"1{f.FakeProperty}"); // FakeEntiites attached to testList, so both changed
            fixture.db.UpdateRange(fixture.db.FakeEntities);
            count = fixture.db.SaveChanges();

            // modify assertion
            Assert.Equal(count, 9);
            Assert.Equal(testCount, fixture.db.FakeEntities.SelectMany(s => fixture.testList.Where(w => w.FakeProperty == s.FakeProperty)).Count());
            Assert.Equal(2 * testCount, fixture.db.AuditLogs.Where(w => w.CreatorId == fixture.userId).Count());
            Assert.Equal(testCount, fixture.db.AuditLogs.Where(w => w.State == EntityState.Modified.ToString()).Count());
            Assert.Equal(2 * testCount, fixture.db.FakeEntityLogs.Where(w => w.ExecutiveId == fixture.userId).Count());

            // delete
            fixture.db.RemoveRange(fixture.db.FakeEntities);
            count = fixture.db.SaveChanges();

            // delete assertion
            Assert.Equal(count, 9);
            Assert.Equal(fixture.db.FakeEntities.Count(), 0);
            Assert.Equal(3 * testCount, fixture.db.AuditLogs.Where(w => w.CreatorId == fixture.userId).Count());
            Assert.Equal(testCount, fixture.db.AuditLogs.Where(w => w.State == EntityState.Deleted.ToString()).Count());
            Assert.Equal(3 * testCount, fixture.db.FakeEntityLogs.Where(w => w.ExecutiveId == fixture.userId).Count());

            fixture.Clean();
        }
    }

}
