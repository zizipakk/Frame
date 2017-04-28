using FrameAudit;
using System;
using System.ComponentModel.DataAnnotations;
using static FrameHelper.EntityHelpers;

namespace FrameIO.Data
{
    public enum PortType
    {
        DigitalInput,
        AnalogeInput,
        DigitalOutput
    }

    public class ComPortType : WithInit
    {
        public PortType PortType { get; set; }
        public string AddressFormat { get; set; }
        public string ReadProtocol { get; set; }
        public string WriteProtocol { get; set; }
    }

    public class ComPortTypeLog : ComPortType, ILogModelExtension
    {
        public ComPortTypeLog()
        {
            LogId = Guid.NewGuid();
        }

        [Key]
        public Guid LogId { get; set; }
        public string ExecutiveId { get; set; }
    }

    public class ComPortConfig : WithInit
    {
        public int Number { get; set; }
        public string PortName { get; set; }
        public ComPortType ComPortType { get; set; }
        public ComDeviceConfig ComDeviceConfig { get; set; }
    }

    public class ComPortConfigLog : ComPortConfig, ILogModelExtension
    {
        public ComPortConfigLog()
        {
            LogId = Guid.NewGuid();
        }

        [Key]
        public Guid LogId { get; set; }
        public string ExecutiveId { get; set; }
    }
    
    public class ComDeviceConfig : WithInit
    {
        public string DeviceName { get; set; }
    }

    public class ComDeviceConfigLog : ComPortConfig, ILogModelExtension
    {
        public ComDeviceConfigLog()
        {
            LogId = Guid.NewGuid();
        }

        [Key]
        public Guid LogId { get; set; }
        public string ExecutiveId { get; set; }
    }

}
