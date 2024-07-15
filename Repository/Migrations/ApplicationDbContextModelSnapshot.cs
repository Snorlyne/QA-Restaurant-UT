﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Repository.Context;

#nullable disable

namespace Repository.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("Domain.Entidades.Categorias", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int>("FK_Company")
                        .HasColumnType("int");

                    b.Property<string>("NombreCategoria")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("FK_Company");

                    b.ToTable("Categorias");
                });

            modelBuilder.Entity("Domain.Entidades.Command", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int?>("Cobrador")
                        .HasColumnType("int");

                    b.Property<DateTime>("Fecha")
                        .HasColumnType("datetime2");

                    b.Property<int>("Propietario")
                        .HasColumnType("int");

                    b.Property<int>("Restaurante")
                        .HasColumnType("int");

                    b.Property<decimal>("Total")
                        .HasColumnType("decimal(18,2)");

                    b.HasKey("Id");

                    b.ToTable("Commands");
                });

            modelBuilder.Entity("Domain.Entidades.Company", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Nombre")
                        .IsRequired()
                        .HasMaxLength(60)
                        .HasColumnType("nvarchar(60)");

                    b.HasKey("Id");

                    b.ToTable("Company");
                });

            modelBuilder.Entity("Domain.Entidades.ConfiguracionGeneral", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int>("FK_Company_Id")
                        .HasColumnType("int");

                    b.Property<string>("PasswordGeneral")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("FK_Company_Id");

                    b.ToTable("ConfiguracionGeneral");
                });

            modelBuilder.Entity("Domain.Entidades.Inventario", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Descripcion")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("FK_Categoria")
                        .HasColumnType("int");

                    b.Property<byte[]>("ImagenInventario")
                        .HasColumnType("varbinary(max)");

                    b.Property<string>("Nombre")
                        .HasColumnType("nvarchar(max)");

                    b.Property<decimal>("Precio")
                        .HasColumnType("decimal(18,2)");

                    b.Property<bool>("Preparado")
                        .HasColumnType("bit");

                    b.HasKey("Id");

                    b.HasIndex("FK_Categoria");

                    b.ToTable("Inventario");
                });

            modelBuilder.Entity("Domain.Entidades.Order", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Adicional")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("FK_inventory_id")
                        .HasColumnType("int");

                    b.Property<int?>("FK_person_id")
                        .HasColumnType("int");

                    b.Property<int>("FK_status_id")
                        .HasColumnType("int");

                    b.Property<DateTime>("Fecha")
                        .HasColumnType("datetime2");

                    b.Property<int>("Mesa")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("FK_inventory_id");

                    b.HasIndex("FK_person_id");

                    b.HasIndex("FK_status_id");

                    b.ToTable("Orders");
                });

            modelBuilder.Entity("Domain.Entidades.OrdersInCommand", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int>("FK_command_id")
                        .HasColumnType("int");

                    b.Property<int>("FK_order_id")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("FK_command_id");

                    b.HasIndex("FK_order_id");

                    b.ToTable("OrdersInCommands");
                });

            modelBuilder.Entity("Domain.Entidades.Person", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Apellido_Materno")
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.Property<string>("Apellido_Paterno")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.Property<string>("CURP")
                        .IsRequired()
                        .HasMaxLength(60)
                        .HasColumnType("nvarchar(60)");

                    b.Property<int>("FK_Company_Id")
                        .HasColumnType("int");

                    b.Property<int>("FK_User_Id")
                        .HasColumnType("int");

                    b.Property<DateTime>("FechaNacimiento")
                        .HasColumnType("datetime2");

                    b.Property<byte[]>("Foto")
                        .HasColumnType("varbinary(max)");

                    b.Property<string>("Nombre")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.HasKey("Id");

                    b.HasIndex("FK_Company_Id");

                    b.HasIndex("FK_User_Id");

                    b.ToTable("Person");
                });

            modelBuilder.Entity("Domain.Entidades.Role", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Nombre")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.HasKey("Id");

                    b.ToTable("Role");
                });

            modelBuilder.Entity("Domain.Entidades.Status", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Nombre")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Status");
                });

            modelBuilder.Entity("Domain.Entidades.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(60)
                        .HasColumnType("nvarchar(60)");

                    b.Property<int>("FK_Rol_Id")
                        .HasColumnType("int");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("FK_Rol_Id");

                    b.ToTable("User");
                });

            modelBuilder.Entity("Domain.Entidades.Categorias", b =>
                {
                    b.HasOne("Domain.Entidades.Company", "Company")
                        .WithMany("Categorias")
                        .HasForeignKey("FK_Company")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Company");
                });

            modelBuilder.Entity("Domain.Entidades.ConfiguracionGeneral", b =>
                {
                    b.HasOne("Domain.Entidades.Company", "Company")
                        .WithMany()
                        .HasForeignKey("FK_Company_Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Company");
                });

            modelBuilder.Entity("Domain.Entidades.Inventario", b =>
                {
                    b.HasOne("Domain.Entidades.Categorias", "Categorias")
                        .WithMany("Inventarios")
                        .HasForeignKey("FK_Categoria")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.Navigation("Categorias");
                });

            modelBuilder.Entity("Domain.Entidades.Order", b =>
                {
                    b.HasOne("Domain.Entidades.Inventario", "Inventario")
                        .WithMany("Orders")
                        .HasForeignKey("FK_inventory_id")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("Domain.Entidades.Person", "Person")
                        .WithMany("Orders")
                        .HasForeignKey("FK_person_id")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("Domain.Entidades.Status", "Status")
                        .WithMany("Orders")
                        .HasForeignKey("FK_status_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Inventario");

                    b.Navigation("Person");

                    b.Navigation("Status");
                });

            modelBuilder.Entity("Domain.Entidades.OrdersInCommand", b =>
                {
                    b.HasOne("Domain.Entidades.Command", "Command")
                        .WithMany("OrdersInCommands")
                        .HasForeignKey("FK_command_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Domain.Entidades.Order", "Order")
                        .WithMany("OrdersInCommands")
                        .HasForeignKey("FK_order_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Command");

                    b.Navigation("Order");
                });

            modelBuilder.Entity("Domain.Entidades.Person", b =>
                {
                    b.HasOne("Domain.Entidades.Company", "Company")
                        .WithMany("Persons")
                        .HasForeignKey("FK_Company_Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Domain.Entidades.User", "User")
                        .WithMany()
                        .HasForeignKey("FK_User_Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Company");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Domain.Entidades.User", b =>
                {
                    b.HasOne("Domain.Entidades.Role", "Role")
                        .WithMany("Users")
                        .HasForeignKey("FK_Rol_Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Role");
                });

            modelBuilder.Entity("Domain.Entidades.Categorias", b =>
                {
                    b.Navigation("Inventarios");
                });

            modelBuilder.Entity("Domain.Entidades.Command", b =>
                {
                    b.Navigation("OrdersInCommands");
                });

            modelBuilder.Entity("Domain.Entidades.Company", b =>
                {
                    b.Navigation("Categorias");

                    b.Navigation("Persons");
                });

            modelBuilder.Entity("Domain.Entidades.Inventario", b =>
                {
                    b.Navigation("Orders");
                });

            modelBuilder.Entity("Domain.Entidades.Order", b =>
                {
                    b.Navigation("OrdersInCommands");
                });

            modelBuilder.Entity("Domain.Entidades.Person", b =>
                {
                    b.Navigation("Orders");
                });

            modelBuilder.Entity("Domain.Entidades.Role", b =>
                {
                    b.Navigation("Users");
                });

            modelBuilder.Entity("Domain.Entidades.Status", b =>
                {
                    b.Navigation("Orders");
                });
#pragma warning restore 612, 618
        }
    }
}
