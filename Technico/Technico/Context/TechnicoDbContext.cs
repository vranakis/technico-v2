using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Technico.Models;

namespace Technico.Context;

public class TechnicoDbContext : DbContext
{
    public DbSet<User> Users {  get; set; }
    public DbSet<PropertyItem> PropertyItems { get; set; }
    public DbSet<Repair> Repairs { get; set; }

    public TechnicoDbContext(DbContextOptions<TechnicoDbContext> options) : base(options) { }

    public TechnicoDbContext() { }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("Data Source = localhost\\SQLEXPRESS; Initial Catalog = TechnicoDb; Integrated Security = true; Encrypt = false;");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Repair>()
            .Property(r => r.Cost)
            .HasColumnType("decimal(18, 2)");
    }
}
