﻿namespace Technico.Models;

public class User
{
    public Guid? Id { get; set; }
    public string? Name { get; set; } = string.Empty;
    public string? Surname { get; set; } = string.Empty;
    public string? Address { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; } = string.Empty;
    public string? Email { get; set; } = string.Empty;
    public string? Password { get; set; } = string.Empty;
    public string? VATNumber { get; set; } = string.Empty;
    public bool? IsPropertyOwner { get; set; } = true;
    public List<PropertyItem>? Properties { get; set; } = new List<PropertyItem>();
}
