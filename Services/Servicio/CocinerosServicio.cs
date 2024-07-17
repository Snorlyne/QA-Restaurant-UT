using Domain.Util;
using Domain.ViewModels;
using Domain.DTOs;
using Microsoft.EntityFrameworkCore;
using Repository.Context;
using Services.IServicio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entidades;
using static Domain.ViewModels.CommandVM;

namespace Services.Servicio
{
    public class CocinerosServicio : ICocinerosServicio
    {
        private readonly ApplicationDbContext _context;

        public CocinerosServicio(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Response<List<OrderViewDTO>>> ObtenerOrdenes(int companyId)
        {
            try
            {
                List<OrderViewDTO> listaOrdenes = await _context.Orders
                    .Include(o => o.Status)
                    .Include(o => o.Inventario)
                    .ThenInclude(o => o.Categorias)
                    .Where(o => o.Inventario.Categorias.FK_Company == companyId 
                    && o.Fecha.Date == DateTime.Today 
                    && (o.Status.Id == 1 || o.Status.Id == 2)
                    && o.Inventario.Preparado == true)
                    .Select(o => new OrderViewDTO
                    {
                        Id = o.Id,
                        Mesa = o.Mesa,
                        Adicional = o.Adicional,
                        Status = new StatusVM.StatusView
                        {
                            Id = o.Status.Id,
                            Nombre = o.Status.Nombre
                        },
                        Inventario = new InventarioVM.ViewChef
                        {
                            Id = o.Inventario.Id,
                            ImagenInventario = o.Inventario.ImagenInventario != null? "data:image/png;base64," + Convert.ToBase64String(o.Inventario.ImagenInventario) : null,
                            Nombre = o.Inventario.Nombre
                        }
                    }).ToListAsync();

                return new Response<List<OrderViewDTO>>(listaOrdenes);
            }
            catch (Exception ex)
            {
                return new Response<List<OrderViewDTO>>(ex.Message);
            }
        }
        public async Task<Response<CommandOrderUpdateStatusVM>> ActualizarEstadoOrden(int ordenId, string nuevoEstado)
        {
            try
            {
                var orden = await _context.Orders.FindAsync(ordenId);
                if (orden == null)
                {
                    return new Response<CommandOrderUpdateStatusVM>("Orden no encontrada.");
                }

                var estado = await _context.Status.FirstOrDefaultAsync(s => s.Nombre == nuevoEstado);
                if (estado == null)
                {
                    return new Response<CommandOrderUpdateStatusVM>("Estado no encontrado.");
                }

                orden.FK_status_id = estado.Id;
                await _context.SaveChangesAsync();

                CommandOrderUpdateStatusVM res = new()
                {
                    Id = ordenId,
                    Mesa = orden.Mesa,
                    Status = estado.Id
                };

                return new Response<CommandOrderUpdateStatusVM>(res);
            }
            catch (Exception ex)
            {
                return new Response<CommandOrderUpdateStatusVM>(ex.Message);
            }
        }


    }
}
