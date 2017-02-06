using AutoMapper;
using FrameLog.Data;
using FrameLog.Models;
using System.Collections.Generic;

namespace FrameLog.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Entity > DTO > View
            CreateMap<Log, ILogDTO>();
            CreateMap<IEnumerable<Log>, IEnumerable<ILogDTO>>();
            CreateMap<ILogDTO, ILogView>();
            CreateMap<IEnumerable<ILogDTO>, IEnumerable<ILogView>>();

            // View > DTO > Entity
            CreateMap<ILogView, ILogDTO>();
            CreateMap<ILogDTO, Log>();

        }
    }
}
