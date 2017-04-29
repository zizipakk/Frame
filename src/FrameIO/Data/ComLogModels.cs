using System;
using static FrameHelper.EntityHelpers;

namespace FrameIO.Data
{
    public class ComLog : WithInit
    {        
        public string UserId { get; set; }
        public string Port { get; set; }
        public string Action { get; set; }
        public string Location { get; set; }
    }
}
