using System;
using static FrameHelper.EntityHelpers;

namespace FrameIO.Data
{
    public class ComLog : WithInit
    {        
        public Guid? UserId { get; set; }
        public string Port { get; set; }
        public string Action { get; set; }
    }
}
