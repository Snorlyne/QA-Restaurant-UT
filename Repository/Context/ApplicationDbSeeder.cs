using Domain.Entidades;
using Microsoft.EntityFrameworkCore;
using Repository.Repositorio.GenericRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

                    User user = new()
                    {
                        Email = "root@root.com",
                        Password = "QA-RestaurantRALL123",
                        FK_Rol_Id = 1
                    };
                    _dbContext.Add(user);
                    await _dbContext.SaveChangesAsync();

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

    }
}
