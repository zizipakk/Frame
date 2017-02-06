using FrameLog.Data;
using System;

namespace FrameLog.Models
{
    public interface ILogDTO
    {
        Guid Id { get; set; }
        DateTime TimeStamp { get; set; }
        Guid? UserId { get; set; }
        string Type { get; set; }
        string Message { get; set; }
        string Stack { get; set; }
        string Location { get; set; }
    }

    public class LogDTO : ILogDTO
    {
        public Guid Id { get; set; }
        public DateTime TimeStamp { get; set; }
        public Guid? UserId { get; set; }
        public string Type { get; set; }
        public string Message { get; set; }
        public string Stack { get; set; }
        public string Location { get; set; }
    }

    public interface ILogView
    {
        Guid Id { get; set; }
        DateTime TimeStamp { get; set; }
        Guid? UserId { get; set; }
        string Type { get; set; }
        string Message { get; set; }
        string Stack { get; set; }
        string Location { get; set; }
    }

    public class LogView : LogDTO, ILogView
    {
    }
}
