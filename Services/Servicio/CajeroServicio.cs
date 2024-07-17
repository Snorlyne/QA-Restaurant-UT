using Domain.Entidades;
using Domain.Util;
using Domain.ViewModels;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Repository.Context;
using Services.IServicio;
using static Domain.ViewModels.CajeroVM;
using static Domain.ViewModels.CommandVM;

namespace Services.Servicio
{
    public class CajeroServicio : ICajeroServicio
    {
        private readonly ApplicationDbContext _context;

        public CajeroServicio(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Response<List<ViewComandasCajaVM>>> ObtenerComandas(int companyId)
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
                    .Where(x => x.Command.Restaurante == companyId && x.Command.Fecha.Date == DateTime.Today)
                    .ToListAsync();


                List<ViewComandasCajaVM> viewComandasVMs = ordersInCommands
                    .GroupBy(oic => oic.Command) // Agrupa por Command para agrupar los orders en una comanda
                    .Select(g =>
                    {
                        var orders = g.Select(oic => new OrdenCajaVM
                        {
                            Id = oic.Order.Id,
                            Estado = oic.Order.Status.Nombre,
                            Producto = new ProductoCajaVM
                            {
                                Nombre = oic.Order.Inventario.Nombre, // Asume que Inventario tiene una propiedad Nombre
                                Precio = oic.Order.Inventario.Precio // Asume que Inventario tiene una propiedad Precio que es decimal o similar
                            }
                        }).ToArray();

                        var total = orders.Sum(order => Convert.ToDecimal(order.Producto.Precio)); // Calcula el total sumando los precios de los productos
                                                                                        
                        var estados = orders.Select(o => o.Estado).Distinct().ToList(); // Verificar el estado de las órdenes
                        string estado;
                        if (estados.Any(e => e != "Por cobrar" && e != "Pagando" && e != "Pagado"))
                        {
                            estado = "Activo";
                        }
                        else
                        {
                            estado = estados.FirstOrDefault() ?? "Desconocido";
                        }
                        var Imagen = g.FirstOrDefault().Order.Inventario.ImagenInventario != null ? "data:image/png;base64," + Convert.ToBase64String(g.FirstOrDefault().Order.Inventario.ImagenInventario) : null;
                        return new ViewComandasCajaVM
                        {
                            Id = g.Key.Id,
                            MeseroCargo = _context.Person.FirstOrDefault(p => p.Id == g.Key.Propietario)?.Nombre ?? "Desconocido",
                            Total = total,
                            Mesa = g.FirstOrDefault().Order.Mesa,
                            Estado = estado,
                            Cobrador = _context.Person.FirstOrDefault(p => p.Id == g.Key.Cobrador)?.Nombre ?? "Desconocido",
                            Imagen = Imagen,
                            Ordenes = orders
                        };
                    }).ToList();

                return new Response<List<ViewComandasCajaVM>>(viewComandasVMs);

            }
            catch (Exception ex)
            {
                return new Response<List<ViewComandasCajaVM>>(ex.Message);
            }
        }
        public async Task<Response<CommandUpdateStatusVM>> GenerarTicketDeCobro(int idCommand, int idPerson, int companyId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
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
                    .Where(x => x.Command.Restaurante == companyId 
                          && x.Command.Id == idCommand
                          && x.Order.Status.Nombre == "Por cobrar" 
                          && x.Command.Fecha.Date == DateTime.Today)
                    .ToListAsync();

                if(ordersInCommands.Count == 0) 
                {
                    throw new Exception("No hay comanda para generar Ticket de cobro");
                }

                foreach (var item in ordersInCommands)
                {
                    Order order = item.Order;

                    order.FK_status_id = 5;

                    _context.Orders.Update(order);
                    await _context.SaveChangesAsync();
                }

                Command command = await _context.Commands.FirstOrDefaultAsync(x => x.Id == idCommand);
                command.Cobrador = idPerson;
                _context.Commands.Update(command);
                _context.SaveChanges();

                // Commit la transacción si todo es exitoso
                await transaction.CommitAsync();

                CommandUpdateStatusVM res = new()
                {
                    Id = idCommand,
                    Mesa = ordersInCommands.FirstOrDefault().Order.Mesa,
                    Status = 5
                };

                return new Response<CommandUpdateStatusVM>(res, "Ticket de cobro generado con éxito.");

            }
            catch (Exception ex)
            {
                // Rollback la transacción si ocurre un error
                await transaction.RollbackAsync();
                return new Response<CommandUpdateStatusVM>(ex.Message);
            }

        }
        public async Task<Response<Command>> EliminarComanda(int idCommand, int companyId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                Command command = await _context.Commands.FirstOrDefaultAsync(c => c.Id == idCommand && c.Restaurante == companyId);

                if(command == null)
                {
                    throw new Exception("No existe la comanda");
                }

                await _context.Database.ExecuteSqlRawAsync("EXEC sp_DeleteCommand @idCommand", new SqlParameter("@idCommand", idCommand));

                // Commit la transacción si todo es exitoso
                await transaction.CommitAsync();
                return new Response<Command>(command, "Eliminación con éxito.");

            }catch (Exception ex)
            {
                // Rollback la transacción si ocurre un error
                await transaction.RollbackAsync();
                return new Response<Command>(ex.Message);

            }
        }

        public async Task<Response<CommandOrderDeleteVM>> EliminarOrden(int idOrden, int companyId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            string message = "Orden eliminada con éxito.";
            try
            {
                List<OrdersInCommand> ordersInCommand = await _context.OrdersInCommands
                    .Include(c => c.Order)
                    .Include(c => c.Command)
                    .Where(x => x.Command.Restaurante == companyId && x.Order.FK_status_id != 6)
                    .ToListAsync();

                if (ordersInCommand.Count == 0)
                {
                    throw new Exception("No existe la comanda.");
                }


                Order order = ordersInCommand.Select(o => o.Order).FirstOrDefault(x => x.Id == idOrden);
                if (order == null)
                {
                    throw new Exception("No existe la orden.");
                }
                int idCommand = ordersInCommand.Where(x => x.Order.Id == idOrden).Select(c => c.Command).FirstOrDefault().Id;

                if (ordersInCommand.Count == 1)
                {
                    await _context.Database.ExecuteSqlRawAsync("EXEC sp_DeleteCommand @idCommand", new SqlParameter("@idCommand", idCommand));
                    message = "Comanda eliminada con éxito.";
                }

                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();

                // Commit la transacción si todo es exitoso
                await transaction.CommitAsync();

                CommandOrderDeleteVM res = new()
                {
                    Id = idCommand,
                    OrderId = idOrden
                };
                return new Response<CommandOrderDeleteVM>(res, message);

            }
            catch(Exception ex)
            {
                // Rollback la transacción si ocurre un error
                await transaction.RollbackAsync();
                return new Response<CommandOrderDeleteVM>(ex.Message);
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
