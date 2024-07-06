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
using static Domain.ViewModels.OrderInCommandVM;

namespace Services.Servicio
{
    public class OrderInCommandServicio : IOrderInCommandServicio
    {
        private readonly ApplicationDbContext _context;

        public OrderInCommandServicio(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Response<List<OrderInCommandViewVM>>> ObtenerListaOrderCommands()
        {
            try
            {
                List<OrderInCommandViewVM> listaOrdenesComanda = await _context.OrdersInCommands
                    .Include(c => c.Command)
                    .Include(o => o.Order)
                    .Select(oc => new OrderInCommandViewVM
                    {
                        Id = oc.Id,
                        Command = new()
                        {
                            Id = oc.Command.Id,
                        },
                        Order = new()
                        {
                            Id = oc.Order.Id,
                            Mesa = oc.Order.Mesa

                        }
                    }).ToListAsync();

                return new Response<List<OrderInCommandViewVM>>(listaOrdenesComanda);
            }
            catch (Exception ex)
            {
                return new Response<List<OrderInCommandViewVM>>(ex.Message);
            }
        }
    }
}
