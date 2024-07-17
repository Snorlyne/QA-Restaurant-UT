using Domain.Entidades;
using Domain.Util;
using Domain.ViewModels;
using Microsoft.EntityFrameworkCore;
using Repository.Context;
using Services.IServicio;

namespace Services.Servicio
{
    public class VentasServicio : IVentasServicio
    {
        private readonly ApplicationDbContext _context;

        public VentasServicio(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Response<List<VentasVM>>> ObtenerVentasPorAnio(int companyId)
        {
            // Array de nombres de los meses en inglés
            string[] monthNames = new string[] {
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
            };

            try
            {
                List<VentasVM> ventasVMs = await _context.OrdersInCommands
                .Include(c => c.Order)
                .Include(c => c.Command)
                .Where(x => x.Command.Restaurante == companyId && x.Order.Status.Nombre == "Pagado")
                .GroupBy(x => new { Mes = x.Command.Fecha.Month, Anio = x.Command.Fecha.Year })
                .Select(g => new VentasVM
                {
                    Mes = monthNames[g.Key.Mes - 1], // Convertir el número de mes a nombre
                    Anio = g.Key.Anio,
                    Valor = Math.Round(g.Sum(x => x.Command.Total), 2) // Sumar el total de todas las ventas del mes y año
                })
                .ToListAsync();

                return new Response<List<VentasVM>>(ventasVMs);
            }
            catch (Exception ex)
            {
                return new Response<List<VentasVM>>(ex.Message);
            }
        }
    }
}
