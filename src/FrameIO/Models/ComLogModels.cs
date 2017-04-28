using System;

namespace FrameIO.Models
{
    public interface IComLogBase
    {
        Guid? UserId { get; set; }
        string Port { get; set; }
        string Action { get; set; }
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
        public Guid? UserId { get; set; }
        public string Port { get; set; }
        public string Action { get; set; }
    }

    public class ComLogViewBase : IComLogBase
    {
        public Guid? UserId { get; set; }
        public string Port { get; set; }
        public string Action { get; set; }
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
