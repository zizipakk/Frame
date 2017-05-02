using System;

namespace FrameIO.Models
{
    public interface IComLogBase
    {
        string UserId { get; set; }
        string Port { get; set; }
        string Action { get; set; }
        string Location { get; set; }
    }

    public interface IComLogDTO : IComLogBase
    {
        Guid Id { get; set; }
        DateTime TimeStamp { get; set; }
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

    public class ComLogViewBase : IComLogBase
    {
        public string UserId { get; set; }
        public string Port { get; set; }
        public string Action { get; set; }
        public string Location { get; set; }
    }

    public interface IComLogView : IComLogBase
    {
        Guid Id { get; set; }
        DateTime TimeStamp { get; set; }
    }

    public class ComLogView : ComLogDTO, IComLogView
    {
    }

}
