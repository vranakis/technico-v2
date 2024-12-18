using Microsoft.AspNetCore.Mvc;
using Technico.DTOs;
using Technico.Interfaces;

namespace TechnicoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertyItemController : ControllerBase
    {
        private readonly IPropertyItemService _service;

        public PropertyItemController(IPropertyItemService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<PropertyItemDto>?>> GetItemsAsync() 
        {
            return await _service.GetAllPropertyItemsAsync();
        }

        [HttpGet("property/{propertyId}")]
        public async Task<ActionResult<PropertyItemDto?>> GetItemAsync(Guid propertyId)
        {
            return await _service.GetPropertyItemAsync(propertyId);
        }

        [HttpGet("{userGuid}")]
        public async Task<ActionResult<List<PropertyItemDto>?>> GetItemsByUserId(Guid userGuid)
        {
            return await _service.GetPropertyItemsByOwnerId(userGuid);
        }

        [HttpPost]
        public async Task<ActionResult<PropertyItemDto?>> PostPropertyItemAsync(PropertyItemDto propertyItem)
        {
            Console.WriteLine($"Controller is Creating PropertyItem with OwnerId: {propertyItem.OwnerId}");
            return await _service.CreatePropertyItemAsync(propertyItem);
        }

        [HttpPut]
        public async Task<ActionResult<PropertyItemDto?>> PutPropertyItemAsync(Guid propertyItemId, PropertyItemDto propertyItemDto)
        {
            return await _service.UpdatePropertyItemAsync(propertyItemId, propertyItemDto);
        }

        [HttpDelete]
        public async Task<ActionResult<bool>> DeletePropertyItemAsync(Guid propertyItemId)
        {
            return await _service.DeletePropertyItemAsync(propertyItemId);
        }


    }
}
