using Domain.Entidades;
using Domain.Util;
using Domain.ViewModels;
using Repository.Context;
using Repository.Repositorio.GenericRepository;
using Services.IServicio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Servicio
{
    public class RoleServicio : IRoleServicio
    {
        private readonly GenericRepository<Role> _RoleGR;

        public RoleServicio(ApplicationDbContext context)
        {
            _RoleGR = new GenericRepository<Role>(context);
        }
        public Task<ResponseHelper> Crear(RoleVM.Create empresa)
        {
            throw new NotImplementedException();
        }

        public Task<ResponseHelper> Editar(RoleVM.View empresa)
        {
            throw new NotImplementedException();
        }

        public Task<ResponseHelper> Eliminar(int? id)
        {
            throw new NotImplementedException();
        }

        public async Task<List<RoleVM.View>> ObtenerLista()
        {
            List<RoleVM.View> lista = new List<RoleVM.View>();
            try
            {
                var listaDB = await _RoleGR.ObtieneLista();
                lista = listaDB.Select(x => new RoleVM.View
                {
                    Nombre = x.Nombre

                }).ToList();
            }
            catch (Exception ex)
            {
                return lista;
            }
            return lista;
        }

        public Task<RoleVM.View> ObtenerPorId(int? id)
        {
            throw new NotImplementedException();
        }
    }
}
