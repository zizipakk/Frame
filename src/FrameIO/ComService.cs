using System;
using System.Collections.Generic;
using System.Linq;
using RJCP.IO.Ports;

namespace FrameIO
{
    // Singleton thread safe serial service
    public static class ComService
    {
        public static SerialPortStream src;

        static ComService()
        {
            var c_SourcePort = SerialConfiguration.SourcePort;
            src = new SerialPortStream(c_SourcePort, 115200, 8, Parity.None, StopBits.One);
        }


    }
}
