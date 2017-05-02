using System;
using System.ComponentModel.DataAnnotations;
using static FrameHelper.EntityHelpers;

namespace FrameAudit
{
    public interface ILogModelExtension : IWithTimeStamp
    {
        Guid LogId { get; set; }
        string ExecutiveId { get; set; }
    }

    public class LogModelExtension : ILogModelExtension
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
