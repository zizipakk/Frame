using FrameIO.Data;
using System;
using static FrameHelper.EntityHelpers;

namespace FrameIO.Models
{
    public interface IComPortTypeBase
    {
        PortType PortType { get; set; }
        string AddressFormat { get; set; }
        string ReadProtocol { get; set; }
        string WriteProtocol { get; set; }
    }

    public interface IComPortTypeDTO : IComPortTypeBase, WithIdAndTimeStamp
    {
    }

    public class ComPortTypeDTO : IComPortTypeDTO
    {
        public Guid Id { get; set; }
        public DateTime TimeStamp { get; set; }
        public PortType PortType { get; set; }
        public string AddressFormat { get; set; }
        public string ReadProtocol { get; set; }
        public string WriteProtocol { get; set; }
    }

    public class ComPortTypeViewBase : IComPortTypeBase
    {
        public PortType PortType { get; set; }
        public string AddressFormat { get; set; }
        public string ReadProtocol { get; set; }
        public string WriteProtocol { get; set; }
    }

    public interface IComPortTypeView : IComPortTypeBase, WithIdAndTimeStamp
    {
    }

    public class ComPortTypeView : ComPortTypeDTO, IComPortTypeView
    {
    }

}
