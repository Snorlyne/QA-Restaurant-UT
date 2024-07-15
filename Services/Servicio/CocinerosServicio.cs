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
                    .Where(o => o.Inventario.Categorias.FK_Company == companyId)
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
        public async Task<Response<bool>> ActualizarEstadoOrden(int ordenId, string nuevoEstado)
        {
            try
            {
                var orden = await _context.Orders.FindAsync(ordenId);
                if (orden == null)
                {
                    return new Response<bool>("Orden no encontrada.");
                }

                var estado = await _context.Status.FirstOrDefaultAsync(s => s.Nombre == nuevoEstado);
                if (estado == null)
                {
                    return new Response<bool>("Estado no encontrado.");
                }

                orden.FK_status_id = estado.Id;
                await _context.SaveChangesAsync();

                return new Response<bool>(true);
            }
            catch (Exception ex)
            {
                return new Response<bool>(ex.Message);
            }
        }


    }
}
