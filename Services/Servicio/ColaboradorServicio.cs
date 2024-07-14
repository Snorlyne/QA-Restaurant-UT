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

namespace Services.Servicio
{
    public class ColaboradorServicio : IColaboradorServicio
    {
        private readonly ApplicationDbContext _context;

        public ColaboradorServicio(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Response<List<ColaboradorView>>> ObtenerListaColaborador(int IdEmpresa)
        {
            try
            {
                List<ColaboradorView> view = await _context.Person
        .       Include(x => x.Company)
        .       Include(y => y.User)
        .       Where(p => p.User.Role.Nombre != "Admin" && p.Company.Id == IdEmpresa)
        .       Select(p => new ColaboradorView
               {
                   Apellido_Paterno = p.Apellido_Paterno,
                   Apellido_Materno = p.Apellido_Materno,
                   FechaNacimiento = p.FechaNacimiento,
                   Id = p.Id,
                   Nombre = p.Nombre,
                   CURP = p.CURP,
                   Foto = p.Foto != null ? "data:image/png;base64," + Convert.ToBase64String(p.Foto) : null,
                   Email = p.User.Email,
                   Puesto = TranslateRoleToSpanish(p.User.Role.Nombre)
                })
                   .ToListAsync();

                return new Response<List<ColaboradorView>>(view);
            }
            catch (Exception ex)
            {
                return new Response<List<ColaboradorView>>(ex.Message);
            }
        }
        public async Task<Response<ColaboradorCreate>> ObtenerColaborador(int Id, int IdEmpresa)
        {
            try
            {
                Person person = await _context.Person
                    .Include(x => x.User)
                    .Include(y => y.User.Role)
                    .FirstOrDefaultAsync(p => p.Id == Id && p.User.Role.Nombre != "Admin" && p.Company.Id == IdEmpresa);

                if (person == null)
                {
                    throw new Exception("Usuario no encontrado");
                }
                string? base64String = person.Foto != null
                    ? Convert.ToBase64String(person.Foto)
                    : null;
                ColaboradorCreate view = new()
                {
                    Nombre = person.Nombre,
                    Apellido_Materno = person.Apellido_Materno,
                    Apellido_Paterno = person.Apellido_Paterno,
                    CURP = person.CURP,
                    FechaNacimiento = person.FechaNacimiento,
                    Foto = person.Foto != null ? "data:image/png;base64," + base64String : null,
                    Role = person.User.FK_Rol_Id,
                };

                return new Response<ColaboradorCreate>(view);

            }
            catch (Exception ex)
            {
                return new Response<ColaboradorCreate>(ex.Message);
            }
        }
        public async Task<Response<ColaboradorCreate>> CrearColaborador(ColaboradorCreate request, int IdEmpresa)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                if (request.Role == 1 || request.Role == 2) {
                    throw new Exception("Rol invalido");
                }
                User user = new()
                {
                    Email = await GenerarDireccionCorreo(request, IdEmpresa),
                    Password = await GenerarContrasena(request, IdEmpresa),
                    FK_Rol_Id = request.Role
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
                    FK_Company_Id = IdEmpresa,
                    Foto = !string.IsNullOrEmpty(cleanBase64)
                    ? Convert.FromBase64String(cleanBase64)
                    : null
                };

                _context.Person.Add(person);
                await _context.SaveChangesAsync();

                // Commit la transacción si todo es exitoso
                await transaction.CommitAsync();

                return new Response<ColaboradorCreate>(request, "Colaborador registrado con éxito.");

            }
            catch (Exception ex)
            {
                // Rollback la transacción si ocurre un error
                await transaction.RollbackAsync();

                return new Response<ColaboradorCreate>(ex.Message);
            }
        }
        public async Task<Response<ColaboradorCreate>> EditarColaborador(ColaboradorCreate request, int Id, int IdEmpresa)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                if (request.Role == 1 || request.Role == 2)
                {
                    throw new Exception("Rol invalido");
                }
                Person empleado = await _context.Person.FirstOrDefaultAsync(x => x.Id == Id && x.Company.Id == IdEmpresa);

                if (empleado == null)
                {
                    throw new Exception("Colaborador no encontrado");
                }
                User user = await _context.User.FirstOrDefaultAsync(x => x.Id == empleado.FK_User_Id);
                if (user == null)
                {
                    throw new Exception("Usuario no encontrado");
                }
                string? cleanBase64 = !string.IsNullOrEmpty(request.Foto) && request.Foto.Split(',').Length > 1
                    ? request.Foto.Split(',')[1]
                    : null;

                empleado.Nombre = request.Nombre.Normalize();
                empleado.Apellido_Paterno = request.Apellido_Paterno.Normalize().Replace(" ", "");
                empleado.Apellido_Materno = request.Apellido_Materno.Normalize().Replace(" ", "");
                empleado.CURP = request.CURP.ToUpper();
                empleado.FechaNacimiento = request.FechaNacimiento;
                empleado.Foto = !string.IsNullOrEmpty(cleanBase64)
                    ? Convert.FromBase64String(cleanBase64)
                    : null;

                _context.Update(empleado);
                await _context.SaveChangesAsync();

                if (user.FK_Rol_Id != request.Role) 
                { 
                   user.FK_Rol_Id = request.Role;
                   _context.User.Update(user);
                   await _context.SaveChangesAsync();
                }


                // Commit la transacción si todo es exitoso
                await transaction.CommitAsync();
                return new Response<ColaboradorCreate>(request, "Colaborador editado con éxito.");

            }
            catch (Exception ex)
            {
                // Rollback la transacción si ocurre un error
                await transaction.RollbackAsync();
                return new Response<ColaboradorCreate>(ex.Message);
            }
        }
        public async Task<Response<ClienteView>> EliminarColaborador(int Id, int IdEmpresa)
        {
            try
            {
                Person empleado = await _context.Person.FirstOrDefaultAsync(x => x.Id == Id && x.Company.Id == IdEmpresa);

                if (empleado == null)
                {
                    throw new Exception("Empleado no encontrado");
                }
                // Llamar al procedimiento almacenado para eliminar
                await _context.Database.ExecuteSqlRawAsync("EXEC sp_DeletePerson @PersonId", new SqlParameter("@PersonId", Id));

                return new Response<ClienteView>(null, "Empleado eliminado con éxito.");

            }
            catch (Exception ex)
            {
                return new Response<ClienteView>(ex.Message);
            }
        }

        public static string TranslateRoleToSpanish(string role)
        {
            return role switch
            {
                "Waiter" => "Mesero",
                "Chef" => "Chef",
                "Cashier" => "Cajero",
                _ => role
            };
        }
        public async Task<string?> GenerarDireccionCorreo(ColaboradorCreate persona, int IdEmpresa)
        {
            try
            {
                string curpPrimerosTres = persona.CURP[..3];
                Company company = await _context.Company.FirstOrDefaultAsync(x => x.Id == IdEmpresa);
                string nombreEmpresa = company.Nombre.ToLower().Replace(" ", "");
                string direccionCorreo = $"{persona.Nombre.ToLower().Replace(" ", "")}{persona.Apellido_Paterno.Trim()[..1].ToLower()}{curpPrimerosTres.Trim().ToLower()}@{nombreEmpresa}.com";

                return direccionCorreo;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public async Task<string?> GenerarContrasena(ColaboradorCreate persona, int IdEmpresa)
        {
            try
            {
                Company company = await _context.Company.FirstOrDefaultAsync(x => x.Id == IdEmpresa);
                string nombreEmpresa = company.Nombre.ToLower().Replace(" ", "");
                string curpPrimerosTres = persona.CURP[..3].ToUpper();
                string contrasena = $"{curpPrimerosTres}{nombreEmpresa}@1234";
                string contrasenaHash = HashPassword(contrasena);
                return contrasenaHash;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        //public static string HashPassword(string password)
        //{
        //    using (var sha256 = SHA256.Create())
        //    {
        //        // Calcula el hash de la contraseña
        //        byte[] hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));

        //        // Convierte el hash a una cadena hexadecimal
        //        StringBuilder builder = new StringBuilder();
        //        for (int i = 0; i < hashedBytes.Length; i++)
        //        {
        //            builder.Append(hashedBytes[i].ToString("x2"));
        //        }
        //        return builder.ToString();
        //    }
        //}
        public static string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                byte[] hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
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
