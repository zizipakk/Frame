using System;
using System.ComponentModel.DataAnnotations;

namespace FrameAudit
{
    public class LogModelExtension
    {
        public LogModelExtension()
        {
            LogId = Guid.NewGuid();
            TimeStamp = DateTime.UtcNow;
        }

        [Key]
        public Guid LogId { get; set; }
        public DateTime TimeStamp { get; set; }
        public string ExecutiveId { get; set; }
    }
}
