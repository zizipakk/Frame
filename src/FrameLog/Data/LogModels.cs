using System;
using static FrameHelper.EntityHelpers;

namespace FrameLog.Data
{
    public class Log : WithInit
    {        
        public Guid? UserId { get; set; }
        public string Type { get; set; }
        public string Message { get; set; }
        public string Stack { get; set;  }
        public string Location { get; set; }
    }
}
