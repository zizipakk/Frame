using FrameIO.Data;
using System;
using static FrameHelper.EntityHelpers;

namespace FrameIO.Models
{
    public interface IComPortConfigBase
    {
        int Number { get; set; }
        string PortName { get; set; }
        Guid ComPortTypeId { get; set; }
        Guid ComDeviceConfigId { get; set; }
    }

    public interface IComPortConfigDTO : IComPortConfigBase, IWithIdAndTimeStamp
    {
    }

    public class ComPortConfigDTO : IComPortConfigDTO
    {
        public Guid Id { get; set; }
        public DateTime TimeStamp { get; set; }
        public int Number { get; set; }
        public string PortName { get; set; }
        public Guid ComPortTypeId { get; set; }
        public Guid ComDeviceConfigId { get; set; }
    }

    public class ComPortConfigViewBase : IComPortConfigBase
    {
        public int Number { get; set; }
        public string PortName { get; set; }
        public Guid ComPortTypeId { get; set; }
        public Guid ComDeviceConfigId { get; set; }
    }

    public interface IComPortConfigView : IComPortConfigBase, IWithIdAndTimeStamp
    {
    }

    public class ComPortConfigView : ComPortConfigDTO, IComPortConfigView
    {
    }

}
