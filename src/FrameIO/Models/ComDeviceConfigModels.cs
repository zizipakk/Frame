using FrameIO.Data;
using System;
using static FrameHelper.EntityHelpers;

namespace FrameIO.Models
{
    public interface IComDeviceConfigBase
    {
        string DeviceName { get; set; }
    }

    public interface IComDeviceConfigDTO : IComDeviceConfigBase, IWithIdAndTimeStamp
    {
    }

    public class ComDeviceConfigDTO : IComDeviceConfigDTO
    {
        public Guid Id { get; set; }
        public DateTime TimeStamp { get; set; }
        public string DeviceName { get; set; }
    }

    public class ComDeviceConfigViewBase : IComDeviceConfigBase
    {
        public string DeviceName { get; set; }
    }

    public interface IComDeviceConfigView : IComDeviceConfigBase, IWithIdAndTimeStamp
    {
    }

    public class ComDeviceConfigView : ComDeviceConfigDTO, IComDeviceConfigView
    {
    }

}
