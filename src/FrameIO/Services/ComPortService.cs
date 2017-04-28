using System;
using System.Collections.Generic;
using System.Linq;
using RJCP.IO.Ports;
using FrameIO.Configurations;
using System.Threading.Tasks;

namespace FrameIO.Services
{
    public interface IComPortService
    {
        void OpenPort();

        void ClosePort();

        void WritePort();

        Task<string> ReadPort();

        void InitPort();

        void DisposePort();
    }

    // Singleton thread safe serial service
    public sealed class ComPortService : IComPortService, IDisposable
    {
        public SerialPortStream src = null;
        private static object lockObject = new object();

        ComPortService()
        {
            InitPort();
        }

        public void OpenPort()
        {
        }

        public void ClosePort()
        { }

        public void WritePort()
        { }

        public string ReadPort()
        {
            lock (lockObject)
                if (src.CanRead)
                    return src.Read();
                else
                    return $"{src} port can not read";
        }

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
