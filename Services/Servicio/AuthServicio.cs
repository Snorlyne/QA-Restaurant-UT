using Domain.Entidades;
using Domain.Util;
using Repository.Context;
using Repository.Repositorio.GenericRepository;

namespace Services.Servicio
{
    public class AuthServicio
    {
        private readonly GenericRepository<User> _gRUser;
        private readonly GenericRepository<Role> _gRRole;

        public AuthServicio(ApplicationDbContext context)
        {
            _gRUser = new GenericRepository<User>(context);
            _gRRole = new GenericRepository<Role>(context);
        }

        //public async Task<Response<bool>> Login() 
        //{
        //    try
        //    {
                

        //    }catch (Exception ex)
        //    {

        //    }
        //}
    }
}
