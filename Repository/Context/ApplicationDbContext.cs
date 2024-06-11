using Domain.Entidades;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Context
{
    public class ApplicationDbContext : DbContext
    {
        public virtual DbSet<Role> Role { get; set; }
        public virtual DbSet<User> User { get; set; }
        public virtual DbSet<Person> Person { get; set; }
        public virtual DbSet<Company> Company { get; set; }
        public virtual DbSet<ConfiguracionGeneral> ConfiguracionGeneral { get; set; }
        public virtual DbSet<Inventario> Inventario { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }
    }
}
