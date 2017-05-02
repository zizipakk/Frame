using FrameAudit;
using System;
using static FrameHelper.EntityHelpers;

namespace FrameIO.Data
{
    public enum PortType
    {
        DigitalInput,
        AnalogeInput,
        DigitalOutput
    }

    public interface IComPortType : IWithIdAndTimeStamp
    {
        PortType PortType { get; set; }
        string AddressFormat { get; set; }
        string ReadProtocol { get; set; }
        string WriteProtocol { get; set; }
    }

    public class ComPortType : WithInit, IComPortType
    {
        public PortType PortType { get; set; }
        public string AddressFormat { get; set; }
        public string ReadProtocol { get; set; }
        public string WriteProtocol { get; set; }
    }

    public class ComPortTypeLog : LogModelExtension, IComPortType
    {
        public Guid Id { get; set; }
        public PortType PortType { get; set; }
        public string AddressFormat { get; set; }
        public string ReadProtocol { get; set; }
        public string WriteProtocol { get; set; }
    }

    public interface IComPortConfig : IWithIdAndTimeStamp
    {
        int Number { get; set; }
        string PortName { get; set; }
        ComPortType ComPortType { get; set; }
        ComDeviceConfig ComDeviceConfig { get; set; }
    }

    public class ComPortConfig : WithInit, IComPortConfig
    {
        public int Number { get; set; }
        public string PortName { get; set; }
        public ComPortType ComPortType { get; set; }
        public ComDeviceConfig ComDeviceConfig { get; set; }
    }

    public class ComPortConfigLog : LogModelExtension, IWithIdAndTimeStamp, IComPortConfig
    {
        public Guid Id { get; set; }
        public int Number { get; set; }
        public string PortName { get; set; }
        public ComPortType ComPortType { get; set; }
        public ComDeviceConfig ComDeviceConfig { get; set; }
    }

    public interface IComDeviceConfig : IWithIdAndTimeStamp
    {
        string DeviceName { get; set; }
    }

    public class ComDeviceConfig : WithInit, IComDeviceConfig
    {
        public string DeviceName { get; set; }
    }

    public class ComDeviceConfigLog : LogModelExtension, IWithIdAndTimeStamp, IComDeviceConfig
    {
        public Guid Id { get; set; }
        public string DeviceName { get; set; }
    }

}
