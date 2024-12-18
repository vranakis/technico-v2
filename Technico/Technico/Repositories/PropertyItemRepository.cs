using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Technico.Context;
using Technico.Models;

namespace Technico.Repositories;

public class PropertyItemRepository : IRepository<PropertyItem, Guid>
{
    private readonly TechnicoDbContext _context;

    public PropertyItemRepository(TechnicoDbContext context)
    {
        this._context = context;
    }

    public async Task<PropertyItem?> CreateAsync(PropertyItem t)
    {
        var ownerExists = await _context.Users.AnyAsync(u => u.Id == t.OwnerId);
        if (!ownerExists)
        {
            throw new InvalidOperationException("Invalid OwnerId: The specified user does not exist.");
        }

        Console.WriteLine($"Repository is Creating PropertyItem with OwnerId: {t.OwnerId}");
        _context.PropertyItems.Add(t);
        await _context.SaveChangesAsync();
        return t;
    }

    public async Task<PropertyItem?> DeleteAsync(Guid id)
    {
        var propertyItem = await _context.PropertyItems.FindAsync(id);
        if (propertyItem == null)
        {
            return null;
        }

        _context.PropertyItems.Remove(propertyItem);
        await _context.SaveChangesAsync();
        return propertyItem;
    }

    public async Task<List<PropertyItem>?> GetAllAsync(int pageCount, int pageSize)
    {
        return await _context.PropertyItems.Skip((pageCount-1)*pageSize).Take(pageSize).ToListAsync();
    }

    public async Task<List<PropertyItem>?> GetAllByGuidAsync(Guid ownerId)
    {
        return await _context.PropertyItems
            .Where(p => p.OwnerId == ownerId)
            .ToListAsync();
    }

    public async Task<PropertyItem?> GetAsync(Guid id)
    {
        return await _context.PropertyItems.FindAsync(id);
    }

    public async Task<PropertyItem?> UpdateAsync(Guid id, PropertyItem propertyItem)
    {
        if (propertyItem == null)
        {
            throw new ArgumentNullException(nameof(propertyItem), "Input propertyItem data cannot be null.");
        }

        var existingProperty = await _context.PropertyItems.FindAsync(id);
        if (existingProperty == null)
        {
            return null;
        }

        existingProperty.OwnerVATNumber = propertyItem.OwnerVATNumber;
        existingProperty.OwnerId = propertyItem.OwnerId;    
        existingProperty.Address = propertyItem.Address;
        existingProperty.Repairs = propertyItem.Repairs;
        existingProperty.PropertyType = propertyItem.PropertyType;
        existingProperty.YearOfConstruction = propertyItem.YearOfConstruction;

        await _context.SaveChangesAsync();

        return existingProperty;
    }

    public async Task DeleteRangeAsync(List<PropertyItem> properties)
    {
        _context.PropertyItems.RemoveRange(properties);
        await _context.SaveChangesAsync();
    }
}
