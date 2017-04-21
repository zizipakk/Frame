using FrameHelper;
using Microsoft.EntityFrameworkCore;

namespace FrameLog.Data
{
    public class ApplicationDbContext : DBContextHelper
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        internal virtual DbSet<Log> Logs { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}
