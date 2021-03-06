﻿using System;
using static FrameHelper.EntityHelpers;

namespace FrameLog.Models
{
    public interface ILogDTO : IWithIdAndTimeStamp
    {
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

    public interface ILogView : ILogDTO
    {
    }

    public class LogView : LogDTO, ILogView
    {
    }

}
