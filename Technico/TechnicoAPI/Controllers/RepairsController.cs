using Microsoft.AspNetCore.Mvc;
using Technico.DTOs;
using Technico.Interfaces;

namespace TechnicoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RepairsController : ControllerBase
    {
        private readonly IRepairService _service;

        public RepairsController(IRepairService service)
        {
            _service = service;
        }

        // GET: api/Repairs/
        [HttpGet("today")]
        public async Task<ActionResult<List<RepairDto>?>> GetTodaysRepairs()
        {
            return await _service.GetTodaysRepairsAsync();
        }

        // GET: api/Repairs/
        [HttpGet("all")]
        public async Task<ActionResult<List<RepairDto>?>> GetAllRepairs()
        {
            return await _service.GetAllRepairsAsync();
        }

        // GET: api/Repairs/{id}
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<RepairDto?>> GetRepair(Guid id)
        {
            var repair = await _service.GetRepairAsync(id);
            if (repair == null)
            {
                return NotFound(new { Message = "Repair not found." });
            }
            return repair;
        }

        // GET: api/Repairs/property/{propertyId}
        [HttpGet("property/{propertyId:guid}")]
        public async Task<ActionResult<List<RepairDto>?>> GetRepairsForProperty(Guid propertyId)
        {
            return await _service.GetRepairsForPropertyAsync(propertyId);
        }

        [HttpGet("user/{userId:guid}")]
        public async Task<ActionResult<List<RepairDto>?>> GetRepairsForUser(Guid userId)
        {
            return await _service.GetRepairsForUserAsync(userId);
        }

        // POST: api/Repairs
        [HttpPost]
        public async Task<IActionResult> CreateRepair([FromBody] RepairDto repairDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdRepair = await _service.CreateRepairAsync(repairDto);
            if (createdRepair == null)
            {
                return BadRequest(new { Message = "Failed to create repair." });
            }

            return CreatedAtAction(nameof(GetRepair), new { id = Guid.NewGuid() }, createdRepair);
        }

        // PUT: api/Repairs/{id}
        [HttpPut("{id:guid}")]
        public async Task<ActionResult> UpdateRepair(Guid id, [FromBody] RepairDto updateRepairDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updatedRepair = await _service.UpdateRepairAsync(id, updateRepairDto);
            if (updatedRepair == null)
            {
                return NotFound(new { Message = "Repair not found or failed to update." });
            }

            return Ok(updatedRepair);
        }

        // DELETE: api/Repairs/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteRepair(Guid id)
        {
            var deletedRepair = await _service.DeleteRepairAsync(id);
            if (deletedRepair == null)
            {
                return NotFound(new { Message = "Repair not found or failed to delete." });
            }

            return NoContent();
        }
    }
}