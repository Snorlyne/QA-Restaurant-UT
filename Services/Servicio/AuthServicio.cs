using Domain.Entidades;
using Domain.Util;
using Domain.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Repository.Context;
using Services.IServicio;
using System.IdentityModel.Tokens.Jwt;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using static Domain.ViewModels.UserVM;

namespace Services.Servicio
{
    public class AuthServicio : IAuthServicio
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        public AuthServicio(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        public async Task<Response<AuthVM.Response>> Login(AuthVM.Request request)
        {
            try
            {
                User au = await _context.User.Include(x => x.Role).FirstOrDefaultAsync(x => x.Email == request.Email);

                if (au == null)
                {
                    throw new Exception("Usuario no encontrado");
                }
                request.Password = HashPassword(request.Password);

                if (au.Password != request.Password)
                {
                    throw new Exception("Credenciales Invalidas");
                }
                Person person = await _context.Person.Include(x => x.Company).FirstOrDefaultAsync(x => x.User.Id == au.Id);
                string accessToken = await GenerarToken(au, person);
                AuthVM.Response response = new()
                {
                    Email = request.Email,
                    Rol = au.Role.Nombre,
                    Empresa = person != null ? person.FK_Company_Id : null,
                    Nombre = person != null ? $"{person.Nombre} {person.Apellido_Paterno}": "RALL",
                    JWTtoken = accessToken
                };
                return new Response<AuthVM.Response>(response);
            }
            catch (Exception ex)
            {
                return new Response<AuthVM.Response>(ex.Message);
            }
        }

        public Task<string> GenerarToken(User user, Person? person)
        {
            string? company = person != null ? person.Company.Id.ToString() : "root";
            string? personId = person != null ? person.Id.ToString() : "root";
            var key = _configuration.GetSection("settings").GetSection("secretKey").ToString();
            var keyBytes = Encoding.ASCII.GetBytes(key);

            var claims = new ClaimsIdentity();
            claims.AddClaim(new Claim(ClaimTypes.Email, user.Email));
            claims.AddClaim(new Claim(ClaimTypes.Role, user.Role.Nombre));
            claims.AddClaim(new Claim("companyId", company));
            claims.AddClaim(new Claim("userId", user.Id.ToString()));
            claims.AddClaim(new Claim("personId", personId));

            var credencialesToken = new SigningCredentials(
                new SymmetricSecurityKey(keyBytes),
                SecurityAlgorithms.HmacSha256Signature
                );

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = claims,
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = credencialesToken
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenConfig = tokenHandler.CreateToken(tokenDescriptor);

            string tokenCreado = tokenHandler.WriteToken(tokenConfig);

            return Task.FromResult(tokenCreado);


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
        public async Task<Response<bool>> CambiarContrasena(int Id, UserChangePassword request)
        {
            try
            {
                User user = await _context.User.FindAsync(Id);
                if (user == null)
                {
                    throw new Exception("Usuario no encontrado");
                }

                if (HashPassword(request.OldPassword) != user.Password)
                {
                    throw new Exception("La contraseña antigua no es correcta");
                }

                user.Password = HashPassword(request.NewPassword);
                _context.Update(user);
                await _context.SaveChangesAsync();

                return new Response<bool>(true, "Contraseña cambiada con éxito.");
            }
            catch (Exception ex)
            {
                return new Response<bool>(false, ex.Message);
            }
        }

    }
}