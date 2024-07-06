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
        public virtual DbSet<Categorias> Categorias { get; set; }
        public DbSet<Status> Status { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrdersInCommand> OrdersInCommands { get; set; }
        public DbSet<Command> Commands { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Person)
                .WithMany(p => p.Orders)
                .HasForeignKey(o => o.FK_person_id)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Inventario)
                .WithMany(i => i.Orders)
                .HasForeignKey(o => o.FK_inventory_id)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Inventario>()
                .HasOne(i => i.Categorias)
                .WithMany(i => i.Inventarios)
                .HasForeignKey(i => i.FK_Categoria)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<OrdersInCommand>()
               .HasOne(oic => oic.Order)
               .WithMany(o => o.OrdersInCommands)
               .HasForeignKey(oic => oic.FK_order_id);

            modelBuilder.Entity<OrdersInCommand>()
                .HasOne(oic => oic.Command)
                .WithMany(c => c.OrdersInCommands)
                .HasForeignKey(oic => oic.FK_command_id);
        }

    }
}
