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

        bool WritePort(string text);

        string ReadPort();

        void InitPort();

        void DisposePort();
    }

    // Singleton thread safe serial service
    public sealed class ComPortService : IComPortService, IDisposable
    {
        public SerialPortStream src = null;
        private static object lockObject = new object();

        public ComPortService()
        {
            InitPort();
        }

        public void OpenPort()
        {
            lock (lockObject)
                if (src?.IsOpen == false)
                    src.Open();
        }

        public void ClosePort()
        {
            lock (lockObject)
                if (src?.IsOpen == true)
                    src.Close();
        }

        public bool WritePort(string text)
        {
            lock (lockObject)
            {
                if (src?.CanWrite == true)
                {
                    src.Write(text);
                    return true;
                }
                else
                    return false;
            }
        }

        public string ReadPort()
        {
            lock (lockObject)
            {
                var response = "";
                if (src?.CanRead == true)
                    return src.ReadTo(response);
                else
                    return response;
            }
        }

        public void InitPort()
        {
            lock (lockObject)
            {
                if (src == null)
                {
                    var c_SourcePort = ComConfiguration.SourcePort;
                    // TODO: from portconfig
                    src = new SerialPortStream(c_SourcePort, 115200, 8, Parity.None, StopBits.One);
                }
                OpenPort();
            }
        }

        public void DisposePort()
        {
            lock (lockObject)
                if (src != null)
                {
                    ClosePort();
                    src.Dispose();
                }
        }

        public void Dispose()
        {
            lock (lockObject)
                if (src?.IsDisposed == false)
                    DisposePort();
        }
    }
}
