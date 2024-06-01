using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Repository.Context;
using Services.IServicio;
using Services.Servicio;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(swagger =>
{
    swagger.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "QA-Restaurant Web API",
        Version = "v1.0",
        Description = "Web API for QA-Restaurant"
    });
});
builder.Services.AddDbContext<ApplicationDbContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//SERVICES
builder.Services.AddTransient<ApplicationDbSeeder>();
builder.Services.AddTransient<IRoleServicio, RoleServicio>();


var app = builder.Build();
var env = builder.Environment;
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!env.IsProduction())
{
    // Ensure we have the default user added to the store
    SeedData(app);
    void SeedData(IHost app)
    {
        var scopedFactory = app.Services.GetService<IServiceScopeFactory>();
        using (var scope = scopedFactory.CreateScope())
        {
            var dbSeeder = scope.ServiceProvider.GetService<ApplicationDbSeeder>();
            dbSeeder.EnsureSeed().GetAwaiter().GetResult();
        }
    }
}
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
