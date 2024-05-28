using Domain.Entidades;
using Domain.Util;
using Domain.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServicio
{
    public interface IRoleServicio
    {
        Task<Response<Role>> Crear(RoleVM.Create empresa);
        Task<Response<Role>> Editar(RoleVM.View empresa);
        Task<Response<Role>> Eliminar(int? id);
        Task<Response<List<RoleVM.View>>> ObtenerLista();
        Task<Response<RoleVM.View>> ObtenerPorId(int? id);
    }
}
