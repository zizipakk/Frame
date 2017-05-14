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
            CreateMap<List<ComLog>, List<ComLogDTO>>();
            CreateMap<ComLogDTO, ComLogView>();
            CreateMap<List<ComLogDTO>, List<ComLogView>>();

            CreateMap<ComPortType, ComPortTypeDTO>();
            CreateMap<List<ComPortType>, List<ComPortTypeDTO>>();
            CreateMap<ComPortTypeDTO, ComPortTypeView>();
            CreateMap<List<ComPortTypeDTO>, List<ComPortTypeView>>();

            CreateMap<ComPortConfig, ComPortConfigDTO>();
            CreateMap<List<ComPortConfig>, List<ComPortConfigDTO>>();
            CreateMap<ComPortConfigDTO, ComPortConfigView>();
            CreateMap<List<ComPortConfigDTO>, List<ComPortConfigView>>();

            CreateMap<ComDeviceConfig, ComDeviceConfigDTO>();
            CreateMap<List<ComDeviceConfig>, List<ComDeviceConfigDTO>>();
            CreateMap<ComDeviceConfigDTO, ComDeviceConfigView>();
            CreateMap<List<ComDeviceConfigDTO>, List<ComDeviceConfigView>>();

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
