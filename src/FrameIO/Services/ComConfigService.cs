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
        Task<IEnumerable<IComPortTypeDTO>> GetPortType();

        Task<int> SetPortType(IComPortTypeDTO model);

        Task<IEnumerable<IComPortConfigDTO>> GetPortConfig();

        Task<int> SetPortConfig(IComPortConfigDTO model);

        Task<IEnumerable<IComDeviceConfigDTO>> GetDeviceConfig();

        Task<int> SetDeviceConfig(IComDeviceConfigDTO model);

        Task<IEnumerable<IComLogDTO>> GetComLog(FilterModel<ComLog> filter);
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

        public async Task<IEnumerable<IComPortTypeDTO>> GetPortType()
        {
            var result = await db.ComPortTypes.ToListAsync();
            return mapper.Map<IEnumerable<IComPortTypeDTO>>(result);
        }

        public async Task<int> SetPortType(IComPortTypeDTO model)
        {
            await db.ComPortTypes.AddAsync(mapper.Map<ComPortType>(model));
            return await db.SaveChangesAsync();
        }

        public async Task<IEnumerable<IComPortConfigDTO>> GetPortConfig()
        {
            var result = await db.ComPortConfigs.ToListAsync();
            return mapper.Map<IEnumerable<IComPortConfigDTO>>(result);
        }

        public async Task<int> SetPortConfig(IComPortConfigDTO model)
        {
            await db.ComPortConfigs.AddAsync(mapper.Map<ComPortConfig>(model));
            return await db.SaveChangesAsync();
        }

        public async Task<IEnumerable<IComDeviceConfigDTO>> GetDeviceConfig()
        {
            var result = await db.ComDeviceConfigs.ToListAsync();
            return mapper.Map<IEnumerable<IComDeviceConfigDTO>>(result);
        }

        public async Task<int> SetDeviceConfig(IComDeviceConfigDTO model)
        {
            await db.ComDeviceConfigs.AddAsync(mapper.Map<ComDeviceConfig>(model));
            return await db.SaveChangesAsync();
        }

        public async Task<IEnumerable<IComLogDTO>> GetComLog(FilterModel<ComLog> filter)
        {
            var result = await db.Query(filter).ToListAsync();
            return mapper.Map<IEnumerable<IComLogDTO>>(result);
        }
    }
}
