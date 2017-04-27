using System;
using System.Collections.Generic;
using System.Linq;
using RJCP.IO.Ports;

namespace FrameIO
{
    // Singleton thread safe serial service
    public sealed class ComService : IDisposable
    {
        public SerialPortStream src = null;

        ComService()
        {
            InitPort();
        }

        public void OpenPort()
        { }

        public void ClosePort()
        { }

        public void WritePort()
        { }

        public void ReadPort()
        { }

        private void InitPort()
        {
            if (src == null)
            {
                var c_SourcePort = SerialConfiguration.SourcePort;
                src = new SerialPortStream(c_SourcePort, 115200, 8, Parity.None, StopBits.One);
            }
        }

        private void DisposePort()
        {
            if (src != null)
                src.Dispose();
        }

        public void Dispose()
        {
            if (src?.IsDisposed == false)
                DisposePort();
        }
    }
}
