using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Technico.Context;
using Technico.Interfaces;
using Technico.Models;
using Technico.Repositories;
using Technico.Services;

var builder = WebApplication.CreateBuilder(args);



// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Dependency Injections
builder.Services.AddScoped<IUserRepo, UserRepository>();
builder.Services.AddScoped<IRepairRepo, RepairRepository>();
builder.Services.AddScoped<IPropertyItemService, PropertyItemService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IRepairService, RepairService>();
builder.Services.AddScoped<IRepository<User, Guid>, UserRepository>();
builder.Services.AddScoped<IRepository<Repair, Guid>, RepairRepository>();
builder.Services.AddScoped<IRepository<PropertyItem, Guid>, PropertyItemRepository>();

// Add DbContext
builder.Services.AddDbContext<TechnicoDbContext>(options => 
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Cors Policy
//builder.Services.AddCors(options =>

//{

//    options.AddPolicy("MyAllow",

//        builder => builder.AllowAnyOrigin()

//                          .AllowAnyMethod()

//                          .AllowAnyHeader());

//});

//cors 1/3 
var MyAllowSpecificOrigins = "AllowAll";
//cors 2/3 
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseCors(MyAllowSpecificOrigins);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
