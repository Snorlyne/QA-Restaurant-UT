﻿using Domain.Entidades;
using Domain.Util;
using Domain.ViewModels;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Repository.Context;
using Services.IServicio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using static Domain.ViewModels.CompanyVM;
using static Domain.ViewModels.PersonVM;

namespace Services.Servicio
{
    public class ClienteServicio : IClienteServicio
    {
        private readonly ApplicationDbContext _context;
        public ClienteServicio(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Response<List<ClienteView>>> ObtenerListaCliente()
        {
            try
            {
                List<ClienteView> view = await _context.Person
                    .Include(x => x.Company)
                    .Where(p => p.User.Role.Nombre == "Admin")
                    .Select(p => new ClienteView
                    {
                        Apellido_Paterno = p.Apellido_Paterno,
                        Apellido_Materno = p.Apellido_Materno,
                        FechaNacimiento = p.FechaNacimiento,
                        Id = p.Id,
                        Nombre = p.Nombre,
                        CURP = p.CURP,
                        Company = new CompanyView()
                        {
                            Id = p.Company.Id,
                            Nombre = p.Company.Nombre
                        }
                    })
                    .ToListAsync();

                 return new Response<List<ClienteView>>(view);

            } catch (Exception ex)
            {
                return new Response<List<ClienteView>>(ex.Message);
            }
        }
        public async Task<Response<ClienteView>> ObtenerCliente(int Id)
        {
            try
            {
                Person person = await _context.Person
                    .Include(x => x.Company)
                    .FirstOrDefaultAsync(p => p.Id == Id);

                if (person == null)
                {
                    throw new Exception("Usuario no encontrado");
                }

                ClienteView view = new()
                {
                    Nombre = person.Nombre,
                    Company = new CompanyView()
                    {
                        Id = person.Company.Id,
                        Nombre = person.Company.Nombre
                    },
                    Apellido_Materno = person.Apellido_Materno,
                    Apellido_Paterno = person.Apellido_Paterno,
                    CURP = person.CURP,
                    FechaNacimiento = person.FechaNacimiento

                };

                return new Response<ClienteView>(view);

            } catch (Exception ex)
            {
                return new Response<ClienteView>(ex.Message);
            }
        }
        public async Task<Response<ClienteCreate>> CrearCliente(ClienteCreate request)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                User user = new()
                {
                    Email = await GenerarDireccionCorreo(request),
                    Password = await GenerarContrasena(request),
                    FK_Rol_Id = 2
                };
                User existUser = await _context.User.FirstOrDefaultAsync(x => x.Email == user.Email);
                if (existUser != null)
                {
                    throw new Exception("Cliente ya Registrado");
                }
                _context.User.Add(user);
                await _context.SaveChangesAsync();

                Person person = new()
                {
                    FK_User_Id = user.Id,
                    Apellido_Paterno = request.Apellido_Paterno,
                    Apellido_Materno = request.Apellido_Materno,
                    Nombre = request.Nombre,
                    CURP = request.CURP,
                    FechaNacimiento = request.FechaNacimiento,
                    FK_Company_Id = request.FK_Company_Id
                };

                _context.Person.Add(person);
                await _context.SaveChangesAsync();

                // Commit la transacción si todo es exitoso
                await transaction.CommitAsync();

                return new Response<ClienteCreate>(request);

            }
            catch (Exception ex)
            {
                // Rollback la transacción si ocurre un error
                await transaction.RollbackAsync();

                return new Response<ClienteCreate>(ex.Message);
            }
        }
        public async Task<Response<ClienteCreate>> EditarCliente(ClienteCreate request, int Id)
        {
            try
            {
                Person cliente = await _context.Person.FindAsync(Id);

                if (cliente == null)
                {
                    throw new Exception("Cliente no encontrado");
                }

                cliente.Nombre = request.Nombre;
                cliente.Apellido_Paterno = request.Apellido_Paterno;
                cliente.Apellido_Materno = request.Apellido_Materno;
                cliente.CURP = request.CURP;
                cliente.FechaNacimiento = request.FechaNacimiento;

                _context.Update(cliente);
                await _context.SaveChangesAsync();

                return new Response<ClienteCreate>(request);

            }catch (Exception ex)
            {
                return new Response<ClienteCreate>(ex.Message);
            }
        }
        public async Task<Response<ClienteView>> EliminarCliente(int Id)
        {
            try
            {
                Person cliente = await _context.Person.FindAsync(Id);

                if (cliente == null)
                {
                    throw new Exception("Cliente no encontrado");
                }
                // Llamar al procedimiento almacenado para eliminar
                await _context.Database.ExecuteSqlRawAsync("EXEC sp_DeletePerson @PersonId", new SqlParameter("@PersonId", Id));

                return new Response<ClienteView>(new ClienteView()
                {
                    Nombre = cliente.Nombre,
                    Apellido_Materno = cliente.Apellido_Materno,
                    Apellido_Paterno = cliente.Apellido_Paterno,
                    FechaNacimiento = cliente.FechaNacimiento,
                    CURP = cliente.CURP
                });
            }
            catch (Exception ex)
            {
                return new Response<ClienteView>(ex.Message);
            }
        }
        public async Task<string?> GenerarDireccionCorreo(ClienteCreate persona)
        {
            try
            {
                string curpPrimerosTres = persona.CURP[..3];
                Company company = await _context.Company.FirstOrDefaultAsync(x => x.Id == persona.FK_Company_Id);
                string direccionCorreo = $"{persona.Nombre.ToLower()}{persona.Apellido_Paterno[..1].ToLower()}{curpPrimerosTres}@{company.Nombre.ToLower().Replace(" ", "")}.com";

                return direccionCorreo;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public async Task<string?> GenerarContrasena(ClienteCreate persona)
        {
            try
            {
                Company company = await _context.Company.FirstOrDefaultAsync(x => x.Id == persona.FK_Company_Id);
                string contrasena = $"{company.Nombre.ToLower()}@1234";
                string contrasenaHash = HashPassword(contrasena);
                return contrasenaHash;
            }
            catch (Exception ex)
            {
                return null;
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