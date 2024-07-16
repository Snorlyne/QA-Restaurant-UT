using Domain.Util;
using Domain.ViewModels;
using Microsoft.EntityFrameworkCore;
using Repository.Context;
using Services.IServicio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Domain.ViewModels.CommandVM;

namespace Services.Servicio
{
    public class CommandServicio : ICommandServicio
    {
        private readonly ApplicationDbContext _context;

        public CommandServicio(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Response<List<CommandViewVM>>> ObtenerListaCommands()
        {
            try
            {
                List<CommandViewVM> listaCommands = await _context.Commands
                    .Select(c => new CommandViewVM
                    {
                        Id = c.Id,
                        Propietario = c.Propietario.ToString(),
                        Cobrador = c.Cobrador.ToString(),
                        Total = c.Total,
                        Fecha = c.Fecha,
                        Restaurante = c.Restaurante
                    }
                ).ToListAsync();

                return new Response<List<CommandViewVM>>(listaCommands);
            }
            catch (Exception ex)
            {
                return new Response<List<CommandViewVM>>(ex.Message);
            }
        }
    }
}
