using Domain.Entidades;
using Domain.Util;
using Repository.Context;
using Repository.Repositorio.GenericRepository;
using Services.IServicio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Domain.ViewModels.StatusVM;

namespace Services.Servicio
{
    public class StatusServicio : IStatusServicio
    {
        private readonly GenericRepository<Status> _StatusR;

        public StatusServicio(ApplicationDbContext context)
        {
            _StatusR = new GenericRepository<Status>(context);   
        }

        public async Task<Response<List<StatusView>>> ObtenerLista()
        {
            List<StatusView> lista = new List<StatusView>();
            try
            {
                var listaDB = await _StatusR.ObtieneLista();
                lista = listaDB.Select(x => new StatusView
                {
                    Id = x.Id,
                    Nombre = x.Nombre,
                }).ToList();
                return new Response<List<StatusView>>(lista);
            }
            catch (Exception ex)
            {
                return new Response<List<StatusView>>(null, ex.Message);
            }
        }
    }
}
