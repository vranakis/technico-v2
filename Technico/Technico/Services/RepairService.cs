using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Technico.DTOs;
using Technico.Interfaces;
using Technico.Models;
using Technico.Repositories;

namespace Technico.Services;

public class RepairService(IRepository<Repair, Guid> repo, IRepairRepo repair) : IRepairService
{
    private readonly IRepository<Repair, Guid> _repo = repo;
    private readonly IRepairRepo _repairRepo = repair;
    public async Task<RepairDto?> CreateRepairAsync(RepairDto repairDto)
    {
        if (repairDto == null)
        {
            throw new ArgumentNullException(nameof(repairDto), "RepairDto can't be null.");
        }

        var createdRepair = await _repo.CreateAsync(new Repair
        {
            RepairId = new Guid(),
            ScheduledDate = repairDto.ScheduledDate,
            Type = repairDto.Type,
            Description = repairDto.Description,
            Address = repairDto.Address,
            Status = repairDto.Status,
            Cost = repairDto.Cost,
            PropertyItemId = repairDto.PropertyItemId,
            UserId = repairDto.UserId,
        });

        if (createdRepair == null)
        {
            return null; 
        }

        return repairDto;

    }

    public async Task<RepairDto?> DeleteRepairAsync(Guid id)
    {
       Repair? repair = await _repo.DeleteAsync(id);
        if (repair == null) 
        {
            return null;
        }

        return new RepairDto { Status = "Deleted" };
    }

    public async Task<RepairDto?> GetRepairAsync(Guid id)
    {
        Repair? repair = await _repo.GetAsync(id);
        if (repair == null)
        {
            return null;
        }

        return new RepairDto
        {
            ScheduledDate = repair.ScheduledDate,
            Type = repair.Type,
            Description = repair.Description,
            Address = repair.Address,
            Status = repair.Status,
            Cost = repair.Cost,
            PropertyItemId = repair.PropertyItemId,
            RepairId = repair.RepairId,
            UserId = repair.UserId
        };
    }

    public async Task<List<RepairDto>?> GetRepairsForPropertyAsync(Guid id)
    {
        List<Repair>? repairs = await _repo.GetAllByGuidAsync(id);

        if (repairs == null)
        {
            return null;
        }

        List<RepairDto> repairResponseDtos = repairs.Select(repair => new RepairDto
        {
            RepairId = repair.RepairId,
            PropertyItemId = repair.PropertyItemId,
            UserId = repair.UserId,
            ScheduledDate = repair.ScheduledDate,
            Type = repair.Type,
            Description = repair.Description,
            Address = repair.Address,
            Status = repair.Status,
            Cost = repair.Cost 
        }).ToList();

        return repairResponseDtos;
    }

    public async Task<List<RepairDto>?> GetRepairsForUserAsync(Guid userId)
    {
        List<Repair>? repairs = await _repairRepo.GetAllByUserGuidAsync(userId);

        if (repairs == null)
        {
            return null;
        }

        List<RepairDto> repairResponseDtos = repairs.Select(repair => new RepairDto
        {
            RepairId = repair.RepairId,
            PropertyItemId = repair.PropertyItemId,
            ScheduledDate = repair.ScheduledDate,
            Type = repair.Type,
            Description = repair.Description,
            Address = repair.Address,
            Status = repair.Status,
            Cost = repair.Cost,
            UserId = repair.UserId
        }).ToList();

        return repairResponseDtos;
    }

    public async Task<List<RepairDto>?> GetTodaysRepairsAsync()
    {
        var todaysRepairs = await _repairRepo.GetAllActiveTodayAsync(1,20);
        if (todaysRepairs == null) { return null; }
        
        var todaysRepairsDto = new List<RepairDto>();
        todaysRepairsDto = todaysRepairs.Select(repair => new RepairDto 
        {
            RepairId = repair.RepairId, 
            PropertyItemId = repair.PropertyItemId, 
            UserId= repair.UserId, 
            ScheduledDate = repair.ScheduledDate, 
            Type = repair.Type, 
            Description = repair.Description, 
            Address = repair.Address, 
            Status = repair.Status, 
            Cost = repair.Cost 
        }).ToList();

        return todaysRepairsDto;
    }

    public async Task<List<RepairDto>?> GetAllRepairsAsync()
    {
        var allRepairs = await _repo.GetAllAsync(1, 20);
        if (allRepairs == null) { return null; }

        var allRepairsDto = new List<RepairDto>();
        allRepairsDto = allRepairs.Select(repair => new RepairDto
        {
            RepairId = repair.RepairId,
            PropertyItemId = repair.PropertyItemId,
            UserId = repair.UserId,
            ScheduledDate = repair.ScheduledDate,
            Type = repair.Type,
            Description = repair.Description,
            Address = repair.Address,
            Status = repair.Status,
            Cost = repair.Cost
        }).ToList();

        return allRepairsDto;
    }


    public async Task<RepairDto?> UpdateRepairAsync(Guid id, RepairDto updateRepairDto)
    {
        if (updateRepairDto == null)
        {
            throw new ArgumentNullException(nameof(updateRepairDto), "Repair cannot be null.");
        }

        var updatedRepair = await _repo.UpdateAsync(id, new Repair {
            Type = updateRepairDto.Type,
            Description = updateRepairDto.Description,
            Address = updateRepairDto.Address,
            ScheduledDate = updateRepairDto.ScheduledDate,
            Status = updateRepairDto.Status,
            Cost = updateRepairDto.Cost
        });

        if (updatedRepair == null)
        {
            return null;
        }
        return updateRepairDto;
       
    }

    public async Task DeleteRepairsByPropertyIdAsync(Guid propertyItemId)
    {
        var repairs = await _repo.GetAllByGuidAsync(propertyItemId);
        if (repairs == null || repairs.Count == 0)
        {
            return; // No repairs to delete
        }

        await _repo.DeleteRangeAsync(repairs);
    }

}
