using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using Technico.DTOs;
using Technico.Models;

namespace Technico.Interfaces;

public interface IPropertyItemService
{
    Task<List<PropertyItemDto>?> GetPropertyItemsByOwnerId(Guid ownerId);
    Task<List<PropertyItemDto>?> GetAllPropertyItemsAsync();
    Task<PropertyItemDto?> GetPropertyItemAsync(Guid propertyItemId);
    Task<PropertyItemDto?> CreatePropertyItemAsync(PropertyItemDto propertyItemDto);
    Task<PropertyItemDto?> UpdatePropertyItemAsync(Guid propertyItemId, PropertyItemDto propertyItem);
    Task<bool> DeletePropertyItemAsync(Guid propertyItemId);
    Task DeletePropertiesByOwnerIdAsync(Guid ownerId);
}
