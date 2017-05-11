using FrameIO.Data;
using System;
using static FrameHelper.EntityHelpers;

namespace FrameIO.Models
{
    public interface IComDeviceConfigDTO : IWithIdAndTimeStamp
    {
        string DeviceName { get; set; }
    }

    public class ComDeviceConfigDTO : IComDeviceConfigDTO
    {
        public Guid Id { get; set; }
        public DateTime TimeStamp { get; set; }
        public string DeviceName { get; set; }
    }

    public interface IComDeviceConfigView : IComDeviceConfigDTO
    {
    }

    public class ComDeviceConfigView : ComDeviceConfigDTO, IComDeviceConfigView
    {
    }

}
