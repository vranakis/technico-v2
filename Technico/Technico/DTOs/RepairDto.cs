using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Technico.Models;

namespace Technico.DTOs;

public class RepairDto
{
    public Guid RepairId { get; set; }
    public DateTime ScheduledDate { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal Cost { get; set; }
    public Guid PropertyItemId { get; set; }
    public Guid UserId { get; set; }
}


