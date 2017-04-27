using System;
using Xunit;
using static FrameTests.FrameIOTestFixtures;
using RJCP.IO.Ports;

namespace FrameTests
{
    public class FrameIOTests : IClassFixture<FrameIOFixture>
    {
        FrameIOFixture fixture;

        public FrameIOTests(FrameIOFixture fixture)
        {
            this.fixture = fixture;
        }

        [Fact]
        public void VersionString()
        {
            using (SerialPortStream src = new SerialPortStream())
            {
                Assert.NotNull(src.Version);
                Console.WriteLine("Version: {0}", src.Version);
            }
        }

        [Fact]
        public void SimpleConstructorWithPort()
        {
            SerialPortStream src = new SerialPortStream(fixture.c_SourcePort);
            Assert.Equal(src.PortName, fixture.c_SourcePort);
            src.Dispose();
            Assert.True(src.IsDisposed);
        }

        [Fact]
        public void SimpleConstructorWithPortGetSettings()
        {
            using (SerialPortStream src = new SerialPortStream(fixture.c_SourcePort, 115200, 8, Parity.None, StopBits.One))
            {
                Assert.Equal(src.PortName, fixture.c_SourcePort);
                src.GetPortSettings();
                Console.WriteLine("    PortName: {0}", src.PortName);
                Console.WriteLine("    BaudRate: {0}", src.BaudRate);
                Console.WriteLine("    DataBits: {0}", src.DataBits);
                Console.WriteLine("      Parity: {0}", src.Parity);
                Console.WriteLine("    StopBits: {0}", src.StopBits);
                Console.WriteLine("   Handshake: {0}", src.Handshake);
                Console.WriteLine(" DiscardNull: {0}", src.DiscardNull);
                Console.WriteLine("  ParityRepl: {0}", src.ParityReplace);
                Console.WriteLine("TxContOnXOff: {0}", src.TxContinueOnXOff);
                Console.WriteLine("   XOffLimit: {0}", src.XOffLimit);
                Console.WriteLine("    XOnLimit: {0}", src.XOnLimit);
                Console.WriteLine("  DrvInQueue: {0}", src.DriverInQueue);
                Console.WriteLine(" DrvOutQueue: {0}", src.DriverOutQueue);
                Console.WriteLine("{0}", src.ToString());
            }
        }

       
        /// <summary>
        /// Test the basic features of a serial port.
        /// </summary>
        [Fact]
        public void OpenCloseBasicProperties()
        {
            using (SerialPortStream src = new SerialPortStream(fixture.c_SourcePort, 115200, 8, Parity.None, StopBits.One))
            {
                src.WriteTimeout = 100;
                src.ReadTimeout = 100;

                Assert.True(src.CanRead);
                Assert.False(src.CanWrite);
                Assert.False(src.IsOpen);
                Assert.Equal(src.PortName, fixture.c_SourcePort);
                Assert.Equal(src.BytesToRead, 0);
                Assert.Equal(src.BytesToWrite, 0);

                src.Open();
                Assert.True(src.CanRead);
                Assert.True(src.CanWrite);
                Assert.True(src.IsOpen);

                src.Close();
                Assert.True(src.CanRead);
                Assert.False(src.CanWrite);
                Assert.False(src.IsOpen);
            }
        }

         [Fact]
        public void OpenInUse()
        {
            using (SerialPortStream src = new SerialPortStream(fixture.c_SourcePort, 115200, 8, Parity.None, StopBits.One))
            {
                src.Open();

                using (SerialPortStream s2 = new SerialPortStream(fixture.c_SourcePort, 9600, 8, Parity.None, StopBits.One))
                {
                    // The port is already open by src, and should be an exclusive resource.
                    Assert.Throws<UnauthorizedAccessException>(() => s2.Open());
                }
            }
        }

        [Fact]
        public void SendReceive()
        {
            using (SerialPortStream src = new SerialPortStream(fixture.c_SourcePort, 115200, 8, Parity.None, StopBits.One))
            using (SerialPortStream dst = new SerialPortStream(fixture.c_DestPort, 115200, 8, Parity.None, StopBits.One))
            {
                src.WriteTimeout = fixture.c_TimeOut; src.ReadTimeout = fixture.c_TimeOut;
                dst.WriteTimeout = fixture.c_TimeOut; dst.ReadTimeout = fixture.c_TimeOut;
                src.Open(); Assert.True(src.IsOpen);
                dst.Open(); Assert.True(dst.IsOpen);

                // Send Maximum data in one go
                byte[] sendbuf = new byte[src.WriteBufferSize];
                Random r = new Random();
                r.NextBytes(sendbuf);
                src.Write(sendbuf, 0, sendbuf.Length);

                // Receive sent data
                int rcv = 0;
                int c = 0;
                byte[] rcvbuf = new byte[sendbuf.Length + 10];
                while (rcv < rcvbuf.Length)
                {
                    Console.WriteLine("Begin Receive: Offset=" + rcv + "; Count=" + (rcvbuf.Length - rcv));
                    int b = dst.Read(rcvbuf, rcv, rcvbuf.Length - rcv);
                    if (b == 0)
                    {
                        if (c == 0) break;
                        c++;
                    }
                    else
                    {
                        c = 0;
                    }
                    rcv += b;
                }

                bool dump = false;
                if (rcv != sendbuf.Length)
                {
                    Console.WriteLine("Read length not the same as the amount of data sent (got " + rcv + " bytes)");
                    dump = true;
                }
                for (int i = 0; i < sendbuf.Length; i++)
                {
                    if (sendbuf[i] != rcvbuf[i])
                    {
                        Console.WriteLine("Comparison failure at " + i);
                        dump = true;
                        break;
                    }
                }

                if (dump)
                {
                    Console.WriteLine("Send Buffer DUMP");
                    for (int i = 0; i < sendbuf.Length; i++)
                    {
                        Console.WriteLine(sendbuf[i].ToString("X2"));
                    }

                    Console.WriteLine("Receive Buffer DUMP");
                    for (int i = 0; i < rcv; i++)
                    {
                        Console.WriteLine(rcvbuf[i].ToString("X2"));
                    }
                }
                src.Close();
                dst.Close();
                Assert.True(dump, "Error in transfer");
            }
        }
    }
}
