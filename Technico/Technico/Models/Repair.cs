using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;

namespace Technico.Models;

public class Repair
{
    public Guid RepairId { get; set; }
    public DateTime ScheduledDate { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";
    public decimal Cost { get; set; }
    [ForeignKey("PropertyItem")]
    public Guid PropertyItemId { get; set; }
    [ForeignKey("User")]
    public Guid UserId { get; set; }
}
