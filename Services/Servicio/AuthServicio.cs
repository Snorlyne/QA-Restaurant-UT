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
                string accessToken = await GenerarToken(au);
                AuthVM.Response response = new()
                {
                    Email = request.Email,
                    Rol = au.Role.Nombre,
                    JWTtoken = accessToken
                };
                return new Response<AuthVM.Response>(response);
            }
            catch (Exception ex)
            {
                return new Response<AuthVM.Response>(ex.Message);
            }
        }

        public Task<string> GenerarToken(User user)
        {

            var key = _configuration.GetSection("settings").GetSection("secretKey").ToString();
            var keyBytes = Encoding.ASCII.GetBytes(key);

            var claims = new ClaimsIdentity();
            claims.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Email));

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
    }
}
