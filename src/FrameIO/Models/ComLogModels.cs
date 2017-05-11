using System;
using static FrameHelper.EntityHelpers;

namespace FrameIO.Models
{
    public interface IComLogDTO : IWithIdAndTimeStamp
    {
        string UserId { get; set; }
        string Port { get; set; }
        string Action { get; set; }
        string Location { get; set; }
    }

    public class ComLogDTO : IComLogDTO
    {
        public Guid Id { get; set; }
        public DateTime TimeStamp { get; set; }
        public string UserId { get; set; }
        public string Port { get; set; }
        public string Action { get; set; }
        public string Location { get; set; }
    }

    public interface IComLogView : IComLogDTO
    {
    }

    public class ComLogView : ComLogDTO, IComLogView
    {
    }

}
