using Domain.Entidades;
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
using static Domain.ViewModels.CajeroVM;

namespace Services.Servicio
{
    public class CajeroServicio : ICajeroServicio
    {
        private readonly ApplicationDbContext _context;

        public CajeroServicio(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Response<List<ViewComandasVM>>> ObtenerComandas(int companyId)
        {
            try
            {
                List<OrdersInCommand> ordersInCommands = await _context.OrdersInCommands
                    .Include(c => c.Order)
                        .ThenInclude(o => o.Status)
                    .Include(c => c.Order)
                        .ThenInclude(o => o.Inventario)
                    .Include(c => c.Order)
                        .ThenInclude(o => o.Person)
                    .Include(c => c.Command)
                    .Where(x => x.Command.Restaurante == companyId && x.Order.Status.Nombre != "Pagado")
                    .ToListAsync();


                List<ViewComandasVM> viewComandasVMs = ordersInCommands
                    .GroupBy(oic => oic.Command) // Agrupa por Command para agrupar los orders en una comanda
                    .Select(g =>
                    {
                        var orders = g.Select(oic => new OrderVM
                        {
                            Id = oic.Order.Id,
                            Estado = oic.Order.Status.Nombre,
                            Producto = new ProductVM
                            {
                                Nombre = oic.Order.Inventario.Nombre, // Asume que Inventario tiene una propiedad Nombre
                                Precio = oic.Order.Inventario.Precio // Asume que Inventario tiene una propiedad Precio que es decimal o similar
                            }
                        }).ToArray();

                        var total = orders.Sum(order => Convert.ToDecimal(order.Producto.Precio)); // Calcula el total sumando los precios de los productos
                                                                                        
                        var estados = orders.Select(o => o.Estado).Distinct().ToList(); // Verificar el estado de las órdenes
                        string estado;
                        if (estados.Any(e => e != "Por cobrar" && e != "Pagando"))
                        {
                            estado = "Activo";
                        }
                        else
                        {
                            estado = estados.FirstOrDefault() ?? "Desconocido";
                        }
                        var Imagen = g.FirstOrDefault().Order.Inventario.ImagenInventario != null ? "data:image/png;base64," + Convert.ToBase64String(g.FirstOrDefault().Order.Inventario.ImagenInventario) : null;
                        return new ViewComandasVM
                        {
                            Id = g.Key.Id,
                            MeseroCargo = _context.Person.FirstOrDefault(p => p.Id == g.Key.Propietario)?.Nombre ?? "Desconocido",
                            Total = total,
                            Mesa = g.FirstOrDefault().Order.Mesa,
                            Estado = estado,
                            Imagen = Imagen,
                            Ordenes = orders
                        };
                    }).ToList();

                return new Response<List<ViewComandasVM>>(viewComandasVMs);

            }
            catch (Exception ex)
            {
                return new Response<List<ViewComandasVM>>(ex.Message);
            }
        }
        public async Task<string> ObtenerEmpleado(int Id)
        {
            try
            {
                var empleado = await _context.Person.FirstOrDefaultAsync(p => p.Id == Id);
                return empleado != null ? empleado.Nombre : "Desconocido";

            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }
}
