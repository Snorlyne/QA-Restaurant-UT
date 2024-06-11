using BaseWeb.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Repository.Context;
using Services.IServicio;
using Services.Servicio;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
IConfiguration configuration = builder.Configuration;

// Add services to the container.
builder.Configuration.AddJsonFile("appsettings.json");
var secretKey = builder.Configuration.GetSection("settings").GetSection("secretKey").ToString();
var keyBytes = Encoding.UTF8.GetBytes(secretKey);

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddSwaggerGen(swagger =>
{
    swagger.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "QA-Restaurant Web API",
        Version = "v1.0",
        Description = "Web API for QA-Restaurant"
    });
    //Mensajes
    swagger.OperationFilter<AuthResponsesOperationFilter>();
    //Ventana emergente de autorizacion que se muestra en la esquina superior derecha
    swagger.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
    {

        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer Scheme. \r\n\r\nExample: \"Bearer sddadsadsadsa\"",
    });
    //Muestra candados a lado derecho de cada endpoint, para definir si se requiere autorizacion o no.
    swagger.AddSecurityRequirement(new OpenApiSecurityRequirement {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] { }
                    }
                });
});

//Configuraci�n de la authenticaci�n
builder.Services.AddAuthentication(config => {

    config.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    config.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(config => {
    config.RequireHttpsMetadata = false;
    config.SaveToken = false;
    config.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"));
    options.AddPolicy("RootPolicy", policy => policy.RequireRole("Root"));
    options.AddPolicy("ChefPolicy", policy => policy.RequireRole("Chef"));
    options.AddPolicy("WaiterPolicy", policy => policy.RequireRole("Waiter"));
    options.AddPolicy("CashierPolicy", policy => policy.RequireRole("Cashier"));
    // Agrega más políticas según sea necesario
});

//SERVICES
builder.Services.AddTransient<ApplicationDbSeeder>();
builder.Services.AddTransient<IRoleServicio, RoleServicio>();
builder.Services.AddTransient<IAuthServicio, AuthServicio>();
builder.Services.AddTransient<ICompanyServicio, CompanyServicio>();
builder.Services.AddTransient<IClienteServicio, ClienteServicio>();

//Configuraci?n para permitir el host del front para hace uso del Web API //Configurar cuando se pase a produccion.
builder.Services.AddCors(options => options.AddPolicy("AllowWebApp", builder => builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

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
app.UseCors("AllowWebApp");

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();


app.MapControllers();

app.Run();
