using AutoMapper;
using FrameIO.Data;
using FrameIO.Models;
using System.Collections.Generic;

namespace FrameIO.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Entity > DTO > View
            CreateMap<ComLog, ComLogDTO>();
            CreateMap<IEnumerable<ComLog>, IEnumerable<ComLogDTO>>();
            CreateMap<ComLogDTO, ComLogView>();
            CreateMap<IEnumerable<ComLogDTO>, IEnumerable<ComLogView>>();

            CreateMap<ComPortType, ComPortTypeDTO>();
            CreateMap<IEnumerable<ComPortType>, IEnumerable<ComPortTypeDTO>>();
            CreateMap<ComPortTypeDTO, ComPortTypeView>();
            CreateMap<IEnumerable<ComPortTypeDTO>, IEnumerable<ComPortTypeView>>();

            CreateMap<ComPortConfig, ComPortConfigDTO>();
            CreateMap<IEnumerable<ComPortConfig>, IEnumerable<ComPortConfigDTO>>();
            CreateMap<ComPortConfigDTO, ComPortConfigView>();
            CreateMap<IEnumerable<ComPortConfigDTO>, IEnumerable<ComPortConfigView>>();

            CreateMap<ComDeviceConfig, ComDeviceConfigDTO>();
            CreateMap<IEnumerable<ComDeviceConfig>, IEnumerable<ComDeviceConfigDTO>>();
            CreateMap<ComDeviceConfigDTO, ComDeviceConfigView>();
            CreateMap<IEnumerable<ComDeviceConfigDTO>, IEnumerable<ComDeviceConfigView>>();

            // View > DTO > Entity
            CreateMap<ComLogView, ComLogDTO>();
            CreateMap<ComLogDTO, ComLog>();

            CreateMap<ComPortTypeView, ComPortTypeDTO>();
            CreateMap<ComPortTypeDTO, ComPortType>();

            CreateMap<ComPortConfigView, ComPortConfigDTO>();
            CreateMap<ComPortConfigDTO, ComPortConfig>();

            CreateMap<ComDeviceConfigView, ComDeviceConfigDTO>();
            CreateMap<ComDeviceConfigDTO, ComDeviceConfig>();

            //Shadows
            CreateMap<ComPortType, ComPortTypeLog>();
            CreateMap<ComPortConfig, ComPortConfigLog>();
            CreateMap<ComDeviceConfig, ComDeviceConfigLog>();
        }
    }
}
