using Azure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Technico.Context;
using Technico.DTOs;
using Technico.Interfaces;
using Technico.Models;
using Technico.Repositories;

namespace Technico.Services;

public class PropertyItemService(IRepository<PropertyItem, Guid> repo, IRepairService repairService) : IPropertyItemService
{
    private readonly IRepository<PropertyItem, Guid> _repo = repo;
    private readonly IRepairService _repairService = repairService;
    
    public async Task<PropertyItemDto?> CreatePropertyItemAsync(PropertyItemDto dto)
    {
        if (dto == null)
        {
            return null;
        }

        Console.WriteLine($"Service is Creating PropertyItem with OwnerId: {dto.OwnerId}");
        var propertyItem = new PropertyItem
        {
            PropertyItemId = Guid.NewGuid(),
            Address = dto.Address,
            YearOfConstruction = dto.YearOfConstruction,
            PropertyType = dto.PropertyType,
            OwnerId = dto.OwnerId
        };

        await _repo.CreateAsync(propertyItem);
        return dto;
    }

    public async Task<bool> DeletePropertyItemAsync(Guid propertyItemId)
    {
        var deletedPropertyItem = await _repo.DeleteAsync(propertyItemId);
        return deletedPropertyItem != null;
    }

    public async Task DeletePropertiesByOwnerIdAsync(Guid ownerId)
    {
        // Fetch properties owned by the user
        var properties = await _repo.GetAllByGuidAsync(ownerId);

        if (properties == null || properties.Count == 0)
        {
            return; // No properties to delete
        }

        // Delete each property and its associated repairs
        foreach (var property in properties)
        {
            await _repairService.DeleteRepairsByPropertyIdAsync(property.PropertyItemId);
        }

        // Delete properties
        await _repo.DeleteRangeAsync(properties);
    }

    public async Task<List<PropertyItemDto>?> GetAllPropertyItemsAsync()
    {
        const int defaultPageCount = 1;
        const int defaultPageSize = 20;
        
        var propertyItems = await _repo.GetAllAsync(defaultPageCount, defaultPageSize);
        if (propertyItems == null)
        {
            return null;
        }

        List<PropertyItemDto> propertyItemsDto = propertyItems.Select(pi => new PropertyItemDto { 
             Id = pi.PropertyItemId,
             Address = pi.Address,
             YearOfConstruction = pi.YearOfConstruction,
             PropertyType = pi.PropertyType,
             OwnerId = pi.OwnerId
        }).ToList();

        return propertyItemsDto;
    }

    public async Task<PropertyItemDto?> GetPropertyItemAsync(Guid propertyItemId)
    {
        var propertyItem = await _repo.GetAsync(propertyItemId);

        if (propertyItem == null)
        {
            return null;
        }

        return new PropertyItemDto
        {
            Address = propertyItem.Address,
            OwnerId = propertyItem.OwnerId,
            Id = propertyItem.PropertyItemId,
            PropertyType = propertyItem.PropertyType,
            YearOfConstruction = propertyItem.YearOfConstruction
        };
    }

    public async Task<List<PropertyItemDto>?> GetPropertyItemsByOwnerId(Guid ownerId)
    {
        List<PropertyItem>? propertyItems = await _repo.GetAllByGuidAsync(ownerId);
        if (propertyItems == null)
        {
            return null;
        }

        List<PropertyItemDto> propertyItemResponseDtos = propertyItems.Select(pi => new PropertyItemDto
        {
            Id = pi.PropertyItemId,
            Address = pi.Address,
            YearOfConstruction = pi.YearOfConstruction,
            PropertyType = pi.PropertyType,
            OwnerId = pi.OwnerId}).ToList();

        return propertyItemResponseDtos;
    }

    public async Task<PropertyItemDto?> UpdatePropertyItemAsync(Guid propertyItemId, PropertyItemDto propertyItemDto)
    {
        if (propertyItemDto == null)
        {
            throw new ArgumentNullException(nameof(propertyItemDto), "propertyItem cannot be null.");
        }

        var propertyItem = new PropertyItem
        {
             Address=propertyItemDto.Address,
             OwnerId=propertyItemDto.OwnerId,
             YearOfConstruction=propertyItemDto.YearOfConstruction,
             PropertyType = propertyItemDto.PropertyType,
             PropertyItemId = propertyItemId
        };

        var updatedPropertyItem = await _repo.UpdateAsync(propertyItemId, propertyItem);

        if (updatedPropertyItem == null)
        {
            return null;
        }

        return new PropertyItemDto
        {
            Address = updatedPropertyItem.Address,
            OwnerId = updatedPropertyItem.OwnerId,
            Id = updatedPropertyItem.PropertyItemId,
            PropertyType = updatedPropertyItem.PropertyType,
            YearOfConstruction = updatedPropertyItem.YearOfConstruction
        };
    }
}
