using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Technico.DTOs;
using Technico.Models;

namespace Technico.Interfaces;

public interface IRepairService
{
    Task<List<RepairDto>?> GetAllRepairsAsync();
    Task<RepairDto?> CreateRepairAsync(RepairDto repairDto);
    Task<RepairDto?> UpdateRepairAsync(Guid id, RepairDto repairDto);
    Task<RepairDto?> DeleteRepairAsync(Guid id);
    Task<RepairDto?> GetRepairAsync(Guid id);
    Task<List<RepairDto>?> GetRepairsForPropertyAsync(Guid id);
    Task<List<RepairDto>?> GetRepairsForUserAsync(Guid id);
    Task<List<RepairDto>?> GetTodaysRepairsAsync();
    Task DeleteRepairsByPropertyIdAsync(Guid propertyItemId);
}
