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
        Task<ResponseHelper> Crear(RoleVM.Create empresa);
        Task<ResponseHelper> Editar(RoleVM.View empresa);
        Task<ResponseHelper> Eliminar(int? id);
        Task<List<RoleVM.View>> ObtenerLista();
        Task<RoleVM.View> ObtenerPorId(int? id);
    }
}
