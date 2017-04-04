using System;
using System.ComponentModel.DataAnnotations;

namespace FrameAudit
{
    interface WithIdAndTimeStamp
    {
        Guid Id { get; set; }
        DateTime TimeStamp { get; set; }
    }

    public class WithInit : WithIdAndTimeStamp
    {
        internal WithInit()
        {
            Id = Guid.NewGuid();
            TimeStamp = DateTime.UtcNow;
        }

        [Key]
        public virtual Guid Id { get; set; }
        public DateTime TimeStamp { get; set; }
    }

    public class AuditLog : WithInit
    {
        public AuditLog()
        {
        }

        public AuditLog(string creatorId, string entity, string location)
        {
            CreatorId = creatorId;
            Entity = entity;
            Location = location;
        }

        public string CreatorId { get; set; }
        public string Entity { get; set; }
        public string State { get; set; }
        public string Action { get; set; }
        public string Location { get; set; }
    }
}
