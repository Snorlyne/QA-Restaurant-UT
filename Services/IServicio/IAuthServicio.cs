using Domain.Util;
using Domain.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServicio
{
    public interface IAuthServicio
    {
        Task<Response<AuthVM.Response>> Login(AuthVM.Request request);
        Task<Response<bool>> CambiarContrasena(int Id, UserVM.UserChangePassword request);

    }
}
