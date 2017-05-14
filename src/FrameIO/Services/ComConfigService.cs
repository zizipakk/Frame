using System.Collections.Generic;
using FrameIO.Data;
using System.Threading.Tasks;
using FrameHelper;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using FrameIO.Models;

namespace FrameIO.Services
{
    public interface IComConfigService
    {
        Task<IList<ComPortTypeDTO>> GetPortTypes();

        Task<int> SetPortType(IComPortTypeDTO model);

        Task<IList<ComPortConfigDTO>> GetPortConfigs();

        Task<int> SetPortConfig(IComPortConfigDTO model);

        Task<IList<ComDeviceConfigDTO>> GetDeviceConfigs();

        Task<int> SetDeviceConfig(IComDeviceConfigDTO model);

        Task<IList<ComLogDTO>> GetComLogs(FilterModel<ComLog> filter);
    }

    public class ComConfigService : IComConfigService
    {
        private readonly ApplicationDbContext db;
        private readonly IMapper mapper;

        public ComConfigService(ApplicationDbContext db, IMapper mapper)
        {
            this.db = db;
            this.mapper = mapper;
        }

        public async Task<IList<ComPortTypeDTO>> GetPortTypes()
        {
            var result = await db.ComPortTypes.ToListAsync();
            return mapper.Map<IList<ComPortTypeDTO>>(result);
        }

        public async Task<int> SetPortType(IComPortTypeDTO model)
        {
            await db.ComPortTypes.AddAsync(mapper.Map<ComPortType>(model));
            return await db.SaveChangesAsync();
        }

        public async Task<IList<ComPortConfigDTO>> GetPortConfigs()
        {
            var result = await db.ComPortConfigs.ToListAsync();
            return mapper.Map<IList<ComPortConfigDTO>>(result);
        }

        public async Task<int> SetPortConfig(IComPortConfigDTO model)
        {
            await db.ComPortConfigs.AddAsync(mapper.Map<ComPortConfig>(model));
            return await db.SaveChangesAsync();
        }

        public async Task<IList<ComDeviceConfigDTO>> GetDeviceConfigs()
        {
            var result = await db.ComDeviceConfigs.ToListAsync();
            return mapper.Map<IList<ComDeviceConfigDTO>>(result);
        }

        public async Task<int> SetDeviceConfig(IComDeviceConfigDTO model)
        {
            await db.ComDeviceConfigs.AddAsync(mapper.Map<ComDeviceConfig>(model));
            return await db.SaveChangesAsync();
        }

        public async Task<IList<ComLogDTO>> GetComLogs(FilterModel<ComLog> filter)
        {
            var result = await db.Query(filter).ToListAsync();
            return mapper.Map<IList<ComLogDTO>>(result);
        }
    }
}
