using Microsoft.EntityFrameworkCore;
using Technico.Context;
using Technico.Interfaces;
using Technico.Models;

namespace Technico.Repositories;

public class RepairRepository(TechnicoDbContext context) : IRepository<Repair, Guid>, IRepairRepo
{
    private readonly TechnicoDbContext _context = context;

    public async Task<List<Repair>?> GetAllActiveTodayAsync(int pageCount, int pageSize)
    {
        var today = DateTime.Today;
        return await _context.Repairs.Where(r => r.ScheduledDate.Date == today).Skip((pageCount - 1) * pageSize).Take(pageSize).ToListAsync();
    }

    public async Task<List<Repair>?> GetAllAsync(int pageCount, int pageSize)
    {
        return await _context.Repairs.ToListAsync();
    }


    public async Task<List<Repair>?> GetAllByGuidAsync(Guid propertyItemId)
    {
        return await _context.Repairs
            .Where(repair => repair.PropertyItemId == propertyItemId)
            .ToListAsync();
    }

    public async Task<List<Repair>?> GetAllByUserGuidAsync(Guid userId)
    {
        return await _context.Repairs.Where(repair => repair.UserId == userId).ToListAsync();
    }

    public async Task<Repair?> CreateAsync(Repair t)
    {
        _context.Repairs.Add(t);
        await _context.SaveChangesAsync();
        return t;
    }

    public async Task<Repair?> DeleteAsync(Guid id)
    {
        var repair = await _context.Repairs.FindAsync(id);
        if (repair == null)
        {
            return null;
        }

        _context.Repairs.Remove(repair);
        await _context.SaveChangesAsync();
        return repair;
    }


    public async Task<Repair?> GetAsync(Guid id)
    {
        return await _context.Repairs.FindAsync(id);        
    }

    public async Task<Repair?> UpdateAsync(Guid id, Repair repair)
    {
        if (repair == null)
        {
            throw new ArgumentNullException(nameof(repair), "Input repair data cannot be null.");
        }

        var existingRepair = await _context.Repairs.FindAsync(id);
        if (existingRepair == null)
        {
            return null;
        }
  
        existingRepair.Cost = repair.Cost;
        existingRepair.Address = repair.Address;
        existingRepair.Status = repair.Status;
        existingRepair.ScheduledDate = repair.ScheduledDate;
        existingRepair.Type = repair.Type;
        existingRepair.Description = repair.Description;

        await _context.SaveChangesAsync();

        return existingRepair;
    }

    public async Task DeleteRangeAsync(List<Repair> repairs)
    {
        _context.Repairs.RemoveRange(repairs);
        await _context.SaveChangesAsync();
    }
}
