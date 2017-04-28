using System;
using System.Collections.Generic;
using System.Linq;
using RJCP.IO.Ports;
using FrameIO.Configurations;

namespace FrameIO.Services
{
    public interface IComConfigService
    {
        void OpenPort();

        void ClosePort();

        void WritePort();

        void ReadPort();

        void InitPort();

        void DisposePort();
    }

    // Singleton thread safe serial service
    public sealed class ComConfigService : IComConfigService, IDisposable
    {
        public SerialPortStream src = null;

        ComPortService()
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

        public void InitPort()
        {
            if (src == null)
            {
                var c_SourcePort = ComConfiguration.SourcePort;
                src = new SerialPortStream(c_SourcePort, 115200, 8, Parity.None, StopBits.One);
            }
        }

        public void DisposePort()
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
