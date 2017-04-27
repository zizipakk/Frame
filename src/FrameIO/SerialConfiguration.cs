using System.Runtime.InteropServices;

namespace FrameIO
{
    public class SerialConfiguration
    {
        private static object m_SyncLock = new object();
        private static string s_SourcePort = null;
        private static string s_DestPort = null;

        static SerialConfiguration()
        {
        }

        public static string SourcePort
        {
            get
            {
                if (s_SourcePort == null)
                    lock (m_SyncLock)
                        if (s_SourcePort == null)
                            s_SourcePort = Startup.Configuration["AppSettings:" + OSPrefix + "SourcePort"];

                return s_SourcePort;
            }
        }

        public static string DestPort
        {
            get
            {
                if (s_DestPort == null)
                    lock (m_SyncLock)
                        if (s_DestPort == null)
                            s_DestPort = Startup.Configuration["AppSettings:" + OSPrefix + "DestPort"];

                return s_DestPort;
            }
        }

        private static string OSPrefix
        {
            get
            {
                if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
                {
                    return "Win32";
                }
                else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
                {
                    return "Linux";
                }
                return "";
            }
        }
    }
}