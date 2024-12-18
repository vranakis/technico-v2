using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Technico.Models;

public class PropertyItem
{
    [Key]
    public Guid PropertyItemId { get; set; }
    public string Address { get; set; } = string.Empty;
    public int YearOfConstruction { get; set; }
    public string PropertyType { get; set; } = string.Empty;
    public string OwnerVATNumber { get; set; } = string.Empty;
    [ForeignKey("User")]
    public Guid OwnerId { get; set; }
    public List<Repair> Repairs { get; set; } = new List<Repair>();
}
