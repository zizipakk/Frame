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
            CreateMap<Log, LogDTO>();
            CreateMap<IEnumerable<Log>, IEnumerable<LogDTO>>();
            CreateMap<LogDTO, LogView>();
            CreateMap<IEnumerable<LogDTO>, IEnumerable<LogView>>();

            // View > DTO > Entity
            CreateMap<LogView, LogDTO>();
            CreateMap<LogDTO, Log>();

        }
    }
}
