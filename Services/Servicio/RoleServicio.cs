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
using static Domain.ViewModels.RoleVM;

namespace Services.Servicio
{
    public class RoleServicio : IRoleServicio
    {
        private readonly GenericRepository<Role> _RoleGR;

        public RoleServicio(ApplicationDbContext context)
        {
            _RoleGR = new GenericRepository<Role>(context);
        }

        public async Task<Response<List<RoleView>>> ObtenerLista()
        {
            List<RoleView> lista = new List<RoleView>();
            try
            {
                var listaDB = await _RoleGR.ObtieneLista();
                lista = listaDB.Select(x => new RoleView
                {
                    Id = x.Id,
                    Nombre = x.Nombre

                }).ToList();
                return new Response<List<RoleView>>(lista);
            }
            catch (Exception ex)
            {
                return new Response<List<RoleView>>(null, ex.Message);
            }
        }
    }
}
