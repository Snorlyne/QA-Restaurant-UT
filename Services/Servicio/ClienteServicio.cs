using Domain.Entidades;
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
using static System.Net.Mime.MediaTypeNames;

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
                    .Include(y => y.User)
                    .Where(p => p.User.Role.Nombre == "Admin")
                    .Select(p => new ClienteView
                    {
                        Apellido_Paterno = p.Apellido_Paterno,
                        Apellido_Materno = p.Apellido_Materno,
                        FechaNacimiento = p.FechaNacimiento,
                        Id = p.Id,
                        Nombre = p.Nombre,
                        CURP = p.CURP,
                        Foto = p.Foto != null ? "data:image/png;base64,"+Convert.ToBase64String(p.Foto) : null,
                        Company = new()
                        {
                            Id = p.Company.Id,
                            Nombre = p.Company.Nombre
                        },
                        User = new()
                        {
                            Email = p.User.Email
                        }
                    })
                    .ToListAsync();

                 return new Response<List<ClienteView>>(view);

            } catch (Exception ex)
            {
                return new Response<List<ClienteView>>(ex.Message);
            }
        }
        public async Task<Response<ClienteCreate>> ObtenerCliente(int Id)
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
                string? base64String = person.Foto != null
                    ? Convert.ToBase64String(person.Foto)
                    : null;
                ClienteCreate view = new()
                {
                    Nombre = person.Nombre,
                    FK_Company_Id = person.FK_Company_Id,
                    Apellido_Materno = person.Apellido_Materno,
                    Apellido_Paterno = person.Apellido_Paterno,
                    CURP = person.CURP,
                    FechaNacimiento = person.FechaNacimiento,
                    Foto = person.Foto != null ? "data:image/png;base64," + base64String:null
            };

                return new Response<ClienteCreate>(view);

            } catch (Exception ex)
            {
                return new Response<ClienteCreate>(ex.Message);
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

                string? cleanBase64 = !string.IsNullOrEmpty(request.Foto) && request.Foto.Split(',').Length > 1
                    ? request.Foto.Split(',')[1]
                    : null;

                Person person = new()
                {
                    FK_User_Id = user.Id,
                    Apellido_Paterno = request.Apellido_Paterno.Replace(" ", "").Normalize(),
                    Apellido_Materno = request.Apellido_Materno.Replace(" ", "").Normalize(),
                    Nombre = request.Nombre.Normalize(),
                    CURP = request.CURP.ToUpper(),
                    FechaNacimiento = request.FechaNacimiento,
                    FK_Company_Id = request.FK_Company_Id,
                    Foto = !string.IsNullOrEmpty(cleanBase64)
                    ? Convert.FromBase64String(cleanBase64)
                    : null
            };

                _context.Person.Add(person);
                await _context.SaveChangesAsync();

                // Commit la transacción si todo es exitoso
                await transaction.CommitAsync();

                return new Response<ClienteCreate>(request, "Cliente registrado con éxito.");

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
                string? cleanBase64 = !string.IsNullOrEmpty(request.Foto) && request.Foto.Split(',').Length > 1
                    ? request.Foto.Split(',')[1]
                    : null;

                cliente.Nombre = request.Nombre.Normalize();
                cliente.Apellido_Paterno = request.Apellido_Paterno.Normalize().Replace(" ", "");
                cliente.Apellido_Materno = request.Apellido_Materno.Normalize().Replace(" ", "");
                cliente.CURP = request.CURP.ToUpper();
                cliente.FechaNacimiento = request.FechaNacimiento;
                cliente.Foto = !string.IsNullOrEmpty(cleanBase64)
                    ? Convert.FromBase64String(cleanBase64)
                    : null;

                _context.Update(cliente);
                await _context.SaveChangesAsync();

                return new Response<ClienteCreate>(request, "Cliente editado con éxito.");

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

                return new Response<ClienteView>(null, "Cliente eliminado con éxito.");

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
                string nombreEmpresa = company.Nombre.ToLower().Replace(" ", "");
                string direccionCorreo = $"{persona.Nombre.ToLower().Replace(" ", "")}{persona.Apellido_Paterno.Trim()[..1].ToLower()}{curpPrimerosTres.Trim().ToLower()}@{nombreEmpresa}.com";

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
                string nombreEmpresa = company.Nombre.ToLower().Replace(" ", "");
                string contrasena = $"{nombreEmpresa}@1234";
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

        //public static string HashPassword(string password)
        //{
        //    using (var sha256 = SHA256.Create())
        //    {
        //        byte[] hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        //        StringBuilder builder = new StringBuilder();
        //        for (int i = 0; i < hashedBytes.Length; i++)
        //        {
        //            builder.Append(hashedBytes[i].ToString("x2"));
        //        }
        //        return builder.ToString();
        //    }
        //}
    }
}
