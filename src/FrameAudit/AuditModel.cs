using static FrameHelper.EntityHelpers;

namespace FrameAudit
{
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

        public string EntityId { get; set; }
        public string CreatorId { get; set; }
        public string Entity { get; set; }
        public string State { get; set; }
        public string Action { get; set; }
        public string Location { get; set; }
    }
}
