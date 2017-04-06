using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;
using static FrameTests.FrameAuditTestFixtures;

namespace FrameTests
{
    public class FrameAuditWithIdentityTests
    {        
        public class FrameAuditTests : IClassFixture<FrameAuditWidthIdentityContextFixture>
        {
            FrameAuditWidthIdentityContextFixture fixture;
            int testCount;

            public FrameAuditTests(FrameAuditWidthIdentityContextFixture fixture)
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
                Assert.Equal(testCount, fixture.db.FakeIdentities.SelectMany(s => fixture.testList.Where(w => w.FakeProperty == s.FakeProperty)).Count());
                Assert.Equal(testCount, fixture.db.AuditLogs.Where(w => w.CreatorId == fixture.userId).Count());
                Assert.Equal(testCount, fixture.db.AuditLogs.Where(w => w.State == EntityState.Added.ToString()).Count());
                Assert.Equal(testCount, fixture.db.FakeIdentityLogs.Where(w => w.ExecutiveId == fixture.userId).Count());

                // modify
                fixture.db.FakeIdentities.ToList().ForEach(f => f.FakeProperty = $"1{f.FakeProperty}"); // FakeIdentities attached to testList, so both changed
                fixture.db.UpdateRange(fixture.db.FakeIdentities);
                count = await fixture.db.SaveChangesAsync();

                // modify assertion
                Assert.Equal(count, 9);
                Assert.Equal(testCount, fixture.db.FakeIdentities.SelectMany(s => fixture.testList.Where(w => w.FakeProperty == s.FakeProperty)).Count());
                Assert.Equal(2 * testCount, fixture.db.AuditLogs.Where(w => w.CreatorId == fixture.userId).Count());
                Assert.Equal(testCount, fixture.db.AuditLogs.Where(w => w.State == EntityState.Modified.ToString()).Count());
                Assert.Equal(2 * testCount, fixture.db.FakeIdentityLogs.Where(w => w.ExecutiveId == fixture.userId).Count());

                // delete
                fixture.db.RemoveRange(fixture.db.FakeIdentities);
                count = await fixture.db.SaveChangesAsync();

                // delete assertion
                Assert.Equal(count, 9);
                Assert.Equal(fixture.db.FakeIdentities.Count(), 0);
                Assert.Equal(3 * testCount, fixture.db.AuditLogs.Where(w => w.CreatorId == fixture.userId).Count());
                Assert.Equal(testCount, fixture.db.AuditLogs.Where(w => w.State == EntityState.Deleted.ToString()).Count());
                Assert.Equal(3 * testCount, fixture.db.FakeIdentityLogs.Where(w => w.ExecutiveId == fixture.userId).Count());

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
                Assert.Equal(testCount, fixture.db.FakeIdentities.SelectMany(s => fixture.testList.Where(w => w.FakeProperty == s.FakeProperty)).Count());
                Assert.Equal(testCount, fixture.db.AuditLogs.Where(w => w.CreatorId == fixture.userId).Count());
                Assert.Equal(testCount, fixture.db.AuditLogs.Where(w => w.State == EntityState.Added.ToString()).Count());
                Assert.Equal(testCount, fixture.db.FakeIdentityLogs.Where(w => w.ExecutiveId == fixture.userId).Count());

                // modify
                fixture.db.FakeIdentities.ToList().ForEach(f => f.FakeProperty = $"1{f.FakeProperty}"); // FakeIdentities attached to testList, so both changed
                fixture.db.UpdateRange(fixture.db.FakeIdentities);
                count = fixture.db.SaveChanges();

                // modify assertion
                Assert.Equal(count, 9);
                Assert.Equal(testCount, fixture.db.FakeIdentities.SelectMany(s => fixture.testList.Where(w => w.FakeProperty == s.FakeProperty)).Count());
                Assert.Equal(2 * testCount, fixture.db.AuditLogs.Where(w => w.CreatorId == fixture.userId).Count());
                Assert.Equal(testCount, fixture.db.AuditLogs.Where(w => w.State == EntityState.Modified.ToString()).Count());
                Assert.Equal(2 * testCount, fixture.db.FakeIdentityLogs.Where(w => w.ExecutiveId == fixture.userId).Count());

                // delete
                fixture.db.RemoveRange(fixture.db.FakeIdentities);
                count = fixture.db.SaveChanges();

                // delete assertion
                Assert.Equal(count, 9);
                Assert.Equal(fixture.db.FakeIdentities.Count(), 0);
                Assert.Equal(3 * testCount, fixture.db.AuditLogs.Where(w => w.CreatorId == fixture.userId).Count());
                Assert.Equal(testCount, fixture.db.AuditLogs.Where(w => w.State == EntityState.Deleted.ToString()).Count());
                Assert.Equal(3 * testCount, fixture.db.FakeIdentityLogs.Where(w => w.ExecutiveId == fixture.userId).Count());

                fixture.Clean();
            }

            [Fact]
            public void TestAuditAndNolog()
            {
                // switch off shadow logging
                fixture.db.common.loggedEntries =
                    new List<Tuple<Type, Type>>
                    {
                        Tuple.Create(typeof(FakeIdentity), default(Type))
                    };

                // insert
                fixture.db.AddRange(fixture.testList);
                var count = fixture.db.SaveChanges();

                // insert assertion
                Assert.Equal(count, 6);
                Assert.Equal(testCount, fixture.db.FakeIdentities.SelectMany(s => fixture.testList.Where(w => w.FakeProperty == s.FakeProperty)).Count());
                Assert.Equal(testCount, fixture.db.AuditLogs.Where(w => w.CreatorId == fixture.userId).Count());
                Assert.Equal(testCount, fixture.db.AuditLogs.Where(w => w.State == EntityState.Added.ToString()).Count());
                Assert.Equal(fixture.db.FakeIdentityLogs.Count(), 0);

                // modify
                fixture.db.FakeIdentities.ToList().ForEach(f => f.FakeProperty = $"1{f.FakeProperty}"); // FakeIdentities attached to testList, so both changed
                fixture.db.UpdateRange(fixture.db.FakeIdentities);
                count = fixture.db.SaveChanges();

                // modify assertion
                Assert.Equal(count, 6);
                Assert.Equal(testCount, fixture.db.FakeIdentities.SelectMany(s => fixture.testList.Where(w => w.FakeProperty == s.FakeProperty)).Count());
                Assert.Equal(2 * testCount, fixture.db.AuditLogs.Where(w => w.CreatorId == fixture.userId).Count());
                Assert.Equal(testCount, fixture.db.AuditLogs.Where(w => w.State == EntityState.Modified.ToString()).Count());
                Assert.Equal(fixture.db.FakeIdentityLogs.Count(), 0);

                // delete
                fixture.db.RemoveRange(fixture.db.FakeIdentities);
                count = fixture.db.SaveChanges();

                // delete assertion
                Assert.Equal(count, 6);
                Assert.Equal(fixture.db.FakeIdentities.Count(), 0);
                Assert.Equal(3 * testCount, fixture.db.AuditLogs.Where(w => w.CreatorId == fixture.userId).Count());
                Assert.Equal(testCount, fixture.db.AuditLogs.Where(w => w.State == EntityState.Deleted.ToString()).Count());
                Assert.Equal(fixture.db.FakeIdentityLogs.Count(), 0);
                
                fixture.Clean();
            }

            [Fact]
            public void TestNoAuditAndNolog()
            {
                // switch off
                fixture.db.common.loggedEntries = null;
                    //new List<Tuple<Type, Type>>
                    //{
                    //    Tuple.Create(default(Type), default(Type))
                    //};

                // insert
                fixture.db.AddRange(fixture.testList);
                var count = fixture.db.SaveChanges();

                // insert assertion
                Assert.Equal(count, 3);
                Assert.Equal(testCount, fixture.db.FakeIdentities.SelectMany(s => fixture.testList.Where(w => w.FakeProperty == s.FakeProperty)).Count());
                Assert.Equal(fixture.db.AuditLogs.Count(), 0);
                Assert.Equal(fixture.db.FakeIdentityLogs.Count(), 0);

                // modify
                fixture.db.FakeIdentities.ToList().ForEach(f => f.FakeProperty = $"1{f.FakeProperty}"); // FakeIdentities attached to testList, so both changed
                fixture.db.UpdateRange(fixture.db.FakeIdentities);
                count = fixture.db.SaveChanges();

                // modify assertion
                Assert.Equal(count, 3);
                Assert.Equal(testCount, fixture.db.FakeIdentities.SelectMany(s => fixture.testList.Where(w => w.FakeProperty == s.FakeProperty)).Count());
                Assert.Equal(fixture.db.AuditLogs.Count(), 0);
                Assert.Equal(fixture.db.FakeIdentityLogs.Count(), 0);

                // delete
                fixture.db.RemoveRange(fixture.db.FakeIdentities);
                count = fixture.db.SaveChanges();

                // delete assertion
                Assert.Equal(count, 3);
                Assert.Equal(fixture.db.FakeIdentities.Count(), 0);
                Assert.Equal(fixture.db.AuditLogs.Count(), 0);
                Assert.Equal(fixture.db.FakeIdentityLogs.Count(), 0);

                fixture.Clean();
            }

            [Fact]
            public void TestAuditAndlogOnlyadded()
            {
                // only insert will be logged
                fixture.db.common.loggedStates = new List<EntityState> { EntityState.Added };
                
                // insert
                fixture.db.AddRange(fixture.testList);
                var count = fixture.db.SaveChanges();

                // insert assertion
                Assert.Equal(count, 9);
                Assert.Equal(testCount, fixture.db.FakeIdentities.SelectMany(s => fixture.testList.Where(w => w.FakeProperty == s.FakeProperty)).Count());
                Assert.Equal(testCount, fixture.db.AuditLogs.Where(w => w.CreatorId == fixture.userId).Count());
                Assert.Equal(testCount, fixture.db.AuditLogs.Where(w => w.State == EntityState.Added.ToString()).Count());
                Assert.Equal(testCount, fixture.db.FakeIdentityLogs.Where(w => w.ExecutiveId == fixture.userId).Count());

                // modify
                fixture.db.FakeIdentities.ToList().ForEach(f => f.FakeProperty = $"1{f.FakeProperty}"); // FakeIdentities attached to testList, so both changed
                fixture.db.UpdateRange(fixture.db.FakeIdentities);
                count = fixture.db.SaveChanges();

                // modify assertion
                Assert.Equal(count, 3);
                Assert.Equal(testCount, fixture.db.FakeIdentities.SelectMany(s => fixture.testList.Where(w => w.FakeProperty == s.FakeProperty)).Count());
                Assert.Equal(fixture.db.AuditLogs.Count(), 3); // still
                Assert.Equal(fixture.db.FakeIdentityLogs.Count(), 3); // still

                // delete
                fixture.db.RemoveRange(fixture.db.FakeIdentities);
                count = fixture.db.SaveChanges();

                // delete assertion
                Assert.Equal(count, 3);
                Assert.Equal(fixture.db.FakeIdentities.Count(), 0);
                Assert.Equal(fixture.db.AuditLogs.Count(), 3); // still
                Assert.Equal(fixture.db.FakeIdentityLogs.Count(), 3); // still

                fixture.Clean();
            }

            [Fact]
            public void TestAuditAndlogOnlymodified()
            {
                // only update will be logged
                fixture.db.common.loggedStates = new List<EntityState> { EntityState.Modified };

                // insert
                fixture.db.AddRange(fixture.testList);
                var count = fixture.db.SaveChanges();

                // insert assertion
                Assert.Equal(count, 3);
                Assert.Equal(testCount, fixture.db.FakeIdentities.SelectMany(s => fixture.testList.Where(w => w.FakeProperty == s.FakeProperty)).Count());
                Assert.Equal(fixture.db.AuditLogs.Count(), 0);
                Assert.Equal(fixture.db.FakeIdentityLogs.Count(), 0);

                // modify
                fixture.db.FakeIdentities.ToList().ForEach(f => f.FakeProperty = $"1{f.FakeProperty}"); // FakeIdentities attached to testList, so both changed
                fixture.db.UpdateRange(fixture.db.FakeIdentities);
                count = fixture.db.SaveChanges();

                // modify assertion
                Assert.Equal(count, 9);
                Assert.Equal(testCount, fixture.db.FakeIdentities.SelectMany(s => fixture.testList.Where(w => w.FakeProperty == s.FakeProperty)).Count());
                Assert.Equal(testCount, fixture.db.AuditLogs.Where(w => w.CreatorId == fixture.userId).Count());
                Assert.Equal(testCount, fixture.db.AuditLogs.Where(w => w.State == EntityState.Modified.ToString()).Count());
                Assert.Equal(testCount, fixture.db.FakeIdentityLogs.Where(w => w.ExecutiveId == fixture.userId).Count());
                

                // delete
                fixture.db.RemoveRange(fixture.db.FakeIdentities);
                count = fixture.db.SaveChanges();

                // delete assertion
                Assert.Equal(count, 3);
                Assert.Equal(fixture.db.FakeIdentities.Count(), 0);
                Assert.Equal(fixture.db.AuditLogs.Count(), 3); // still
                Assert.Equal(fixture.db.FakeIdentityLogs.Count(), 3); // still

                fixture.Clean();
            }

            [Fact]
            public void TestAuditAndlogOnlyDeleted()
            {
                // only deletation will be logged
                fixture.db.common.loggedStates = new List<EntityState> { EntityState.Deleted };

                // insert
                fixture.db.AddRange(fixture.testList);
                var count = fixture.db.SaveChanges();

                // insert assertion
                Assert.Equal(count, 3);
                Assert.Equal(testCount, fixture.db.FakeIdentities.SelectMany(s => fixture.testList.Where(w => w.FakeProperty == s.FakeProperty)).Count());
                Assert.Equal(fixture.db.AuditLogs.Count(), 0);
                Assert.Equal(fixture.db.FakeIdentityLogs.Count(), 0);

                // modify
                fixture.db.FakeIdentities.ToList().ForEach(f => f.FakeProperty = $"1{f.FakeProperty}"); // FakeIdentities attached to testList, so both changed
                fixture.db.UpdateRange(fixture.db.FakeIdentities);
                count = fixture.db.SaveChanges();

                // modify assertion
                Assert.Equal(count, 3);
                Assert.Equal(testCount, fixture.db.FakeIdentities.SelectMany(s => fixture.testList.Where(w => w.FakeProperty == s.FakeProperty)).Count());
                Assert.Equal(fixture.db.AuditLogs.Count(), 0);
                Assert.Equal(fixture.db.FakeIdentityLogs.Count(), 0);

                // delete
                fixture.db.RemoveRange(fixture.db.FakeIdentities);
                count = fixture.db.SaveChanges();

                // delete assertion
                Assert.Equal(count, 9);
                Assert.Equal(fixture.db.FakeIdentities.Count(), 0);
                Assert.Equal(testCount, fixture.db.AuditLogs.Where(w => w.CreatorId == fixture.userId).Count());
                Assert.Equal(testCount, fixture.db.AuditLogs.Where(w => w.State == EntityState.Deleted.ToString()).Count());
                Assert.Equal(testCount, fixture.db.FakeIdentityLogs.Where(w => w.ExecutiveId == fixture.userId).Count());

                fixture.Clean();
            }

            [Fact]
            public void TestAuditAndlogByNoStates()
            {
                // switch off logging
                fixture.db.common.loggedStates = null;

                // insert
                fixture.db.AddRange(fixture.testList);
                var count = fixture.db.SaveChanges();

                // insert assertion
                Assert.Equal(count, 3);
                Assert.Equal(testCount, fixture.db.FakeIdentities.SelectMany(s => fixture.testList.Where(w => w.FakeProperty == s.FakeProperty)).Count());
                Assert.Equal(fixture.db.AuditLogs.Count(), 0);
                Assert.Equal(fixture.db.FakeIdentityLogs.Count(), 0);

                // modify
                fixture.db.FakeIdentities.ToList().ForEach(f => f.FakeProperty = $"1{f.FakeProperty}"); // FakeIdentities attached to testList, so both changed
                fixture.db.UpdateRange(fixture.db.FakeIdentities);
                count = fixture.db.SaveChanges();

                // modify assertion
                Assert.Equal(count, 3);
                Assert.Equal(testCount, fixture.db.FakeIdentities.SelectMany(s => fixture.testList.Where(w => w.FakeProperty == s.FakeProperty)).Count());
                Assert.Equal(fixture.db.AuditLogs.Count(), 0);
                Assert.Equal(fixture.db.FakeIdentityLogs.Count(), 0);

                // delete
                fixture.db.RemoveRange(fixture.db.FakeIdentities);
                count = fixture.db.SaveChanges();

                // delete assertion
                Assert.Equal(count, 3);
                Assert.Equal(fixture.db.FakeIdentities.Count(), 0);
                Assert.Equal(fixture.db.AuditLogs.Count(), 0);
                Assert.Equal(fixture.db.FakeIdentityLogs.Count(), 0);

                fixture.Clean();
            }

            // TODO: test switching tables
        }
    }
}
