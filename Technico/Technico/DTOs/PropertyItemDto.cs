using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Technico.DTOs;

public class PropertyItemDto
{
    public Guid Id { get; set; }
    public string Address { get; set; } = string.Empty;
    public int YearOfConstruction { get; set; }
    public string PropertyType { get; set; } = string.Empty;
    public Guid OwnerId { get; set; }
}