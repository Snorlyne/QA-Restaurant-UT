using Domain.Entidades;
using Domain.Util;
using Domain.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Domain.ViewModels.RoleVM;

namespace Services.IServicio
{
    public interface IRoleServicio
    {
        Task<Response<List<RoleView>>> ObtenerLista();
    }
}
