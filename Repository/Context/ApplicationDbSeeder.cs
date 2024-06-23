using Domain.Entidades;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace Repository.Context
{
    public class ApplicationDbSeeder
    {
        private readonly ApplicationDbContext _dbContext;
        private bool _seeded;

        public ApplicationDbSeeder(ApplicationDbContext context)
        {
            _dbContext = context;
        }

        public async Task EnsureSeed()
        {
            if (!_seeded)
            {
                try
                {
                    User existingUser = await _dbContext.User.FirstOrDefaultAsync(x => x.Email == "root@root.com");
                    if (existingUser != null)
                    {
                        Console.WriteLine("Database already seeded!");
                        _seeded = true;
                        return;
                    }
                    string[] roleNames = { "Root", "Admin", "Chef", "Waiter","Cashier" };
                    foreach (var roleName in roleNames)
                    {
                        Role role = new();

                        var roleExist = await _dbContext.Role.FirstOrDefaultAsync(x => x.Nombre == roleName);
                        if (roleExist == null)
                        {
                            role.Nombre = roleName;
                            _dbContext.Role.Add(role);
                            await _dbContext.SaveChangesAsync();
                        }
                    }
                    string password = HashPassword("QA-RestaurantRALL123");
                    User user = new()
                    {
                        Email = "root@root.com",
                        Password = password,
                        FK_Rol_Id = 1
                    };
                    _dbContext.Add(user);
                    await _dbContext.SaveChangesAsync();

                    //Agregar estados para orden

                    string[] statusNames = { "Anotado", "En preparación", "Pedido listo", "Por cobrar", "Pagando", "Pagado" };
                    foreach (var statusName in statusNames)
                    {
                        Status status = new Status();

                        var statusExist = await _dbContext.Status.FirstOrDefaultAsync(x => x.Nombre == statusName);
                        if (statusExist == null) 
                        {
                            status.Nombre = statusName;
                            _dbContext.Status.Add(status);
                            await _dbContext.SaveChangesAsync();
                        }
                    }

                    _seeded = true;
                    return;
                }
                catch (Exception ex)
                {
                    Console.Error.WriteLine("Error trying to seed the database");
                    Console.Error.WriteLine(ex);
                    return;
                }
             }
        }
        public static string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                // Calcula el hash de la contraseña
                byte[] hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));

                // Convierte el hash a una cadena hexadecimal
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < hashedBytes.Length; i++)
                {
                    builder.Append(hashedBytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }

    }
}
