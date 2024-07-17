using Domain.Entidades;
using Domain.Util;
using Domain.ViewModels;
using Microsoft.EntityFrameworkCore;
using Repository.Context;
using Services.IServicio;
using System.ComponentModel.Design;
using static Domain.ViewModels.CommandVM;
using static Domain.ViewModels.MeseroVM;
using static Domain.ViewModels.OrderVM;

namespace Services.Servicio
{
    public  class MeseroServicio : IMeseroServicio
    {
        private readonly ApplicationDbContext _context;

        public MeseroServicio(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Response<List<ViewComandasMeseroVM>>> ObtenerComandas(int personId, int companyId)
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
                    .Where(x => x.Command.Restaurante == companyId 
                                && x.Command.Fecha.Date == DateTime.Today 
                                && x.Command.Propietario == personId 
                                && x.Order.Status.Nombre != "Pagado")
                    .ToListAsync();

                List<ViewComandasMeseroVM> viewComandasVMs = ordersInCommands
                    .GroupBy(oic => oic.Command) // Agrupa por Command para agrupar los orders en una comanda
                    .Select(g =>
                    {
                        var orders = g.Select(oic => new OrdenMeseroVM
                        {
                            Id = oic.Order.Id,
                            Estado = oic.Order.Status.Nombre,
                            Producto = new ProductoMeseroVM
                            {
                                Nombre = oic.Order.Inventario.Nombre                                
                            }
                        }).ToArray();

                        var estados = g.Select(o => o.Order.Status.Nombre).Distinct().ToList();
                        string estado = "Desconocido"; // Valor por defecto

                        var prioridades = new List<string> { "Pedido listo", "En preparación", "Anotado", "Por cobrar", "Pagando" };

                        foreach (var prioridad in prioridades)
                        {
                            if (estados.Contains(prioridad))
                            {
                                estado = prioridad switch
                                {
                                    "Pedido listo" => "Pedido listo para entregar.",
                                    "En preparación" => "Pedido en preparación",
                                    "Anotado" => "En espera.",
                                    "Por cobrar" => "En espera del Ticket.",
                                    "Pagando" => "Listo para cobrar.",
                                    _ => estado
                                };
                                break;
                            }
                        }

                        // Si no se encontró ningún estado de prioridad, se toma el primer estado disponible
                        if (estado == "Desconocido" && estados.Count > 0)
                        {
                            estado = estados.First();
                        }
                        return new ViewComandasMeseroVM
                        {
                            Id = g.Key.Id,
                            Mesa = g.FirstOrDefault().Order.Mesa,
                            Estado = estado,
                            Ordenes = orders
                        };
                    }).ToList();
                return new Response<List<ViewComandasMeseroVM>>(viewComandasVMs);
            }
            catch (Exception ex)
            {
                return new Response<List<ViewComandasMeseroVM>>(ex.Message);
            }
        }
        public async Task<Response<CommandViewVM>> CrearComandaYOrdenes(int idPerson, int companyId, CommandCreateVM req)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            Command command = new();
            string tipo = "newComanda";
            try
            {
                decimal total = 0;
                List<Order> orders = new();
                var inventarioIds = req.Ordenes.Select(o => o.FK_inventory_id).Distinct().ToList();
                var inventarios = await _context.Inventario
                    .Where(i => inventarioIds.Contains(i.Id))
                    .ToDictionaryAsync(i => i.Id);

                foreach (OrderCreateVM orden in req.Ordenes)
                {
                    Order order = new()
                    {
                        Adicional = orden.Adicional,
                        Fecha = DateTime.Now,
                        FK_person_id = idPerson,
                        FK_inventory_id = orden.FK_inventory_id,
                        FK_status_id = 1,
                        Mesa = req.Mesa
                    };
                    _context.Orders.Add(order);
                    await _context.SaveChangesAsync();
                    total += inventarios[(int)orden.FK_inventory_id].Precio;
                    orders.Add(order);
                }

                var existingCommand = await _context.OrdersInCommands
                    .Include(c => c.Order)
                        .ThenInclude(o => o.Person)
                    .Include(c => c.Command)
                    .Where(x => x.Command.Restaurante == companyId
                                && x.Command.Fecha.Date == DateTime.Today
                                && x.Order.Status.Nombre != "Pagado"
                                && x.Order.Mesa == req.Mesa)
                    .Select(x => x.Command)
                    .FirstOrDefaultAsync();

                if (existingCommand == null)
                {
                    command = new()
                    {
                        Fecha = DateTime.Now,
                        Propietario = idPerson,
                        Restaurante = companyId,
                        Total = total,
                    };
                    _context.Commands.Add(command);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    existingCommand.Total += total;
                    _context.Commands.Update(existingCommand);
                    await _context.SaveChangesAsync();
                    command = existingCommand;
                    tipo = "newOrder";
                }


                foreach (Order order in orders)
                {
                    OrdersInCommand ordersInCommand = new()
                    {
                        FK_order_id = order.Id,
                        FK_command_id = command.Id
                    };
                    _context.OrdersInCommands.Add(ordersInCommand);
                }
                await _context.SaveChangesAsync();


                CommandViewVM commandVM = new()
                {
                    Propietario = await ObtenerEmpleado(command.Propietario),
                    Id = command.Id,
                    Fecha = command.Fecha,
                    Restaurante = command.Restaurante,
                    Total = command.Total,
                    Tipo = tipo,
                    Ordenes = orders.Select(x => new OrderViewVM
                    {
                        Fecha = x.Fecha,
                        Adicional = x.Adicional,
                        Id = x.Id,
                        Mesa = x.Mesa,
                        Producto = new()
                        {
                            Descripcion = inventarios[(int)x.FK_inventory_id].Descripcion,
                            Id = (int)x.FK_inventory_id,
                            ImagenInventario = inventarios[(int)x.FK_inventory_id].ImagenInventario != null ?
                                "data:image/png;base64," + Convert.ToBase64String(inventarios[(int)x.FK_inventory_id].ImagenInventario) : null,
                            Nombre = inventarios[(int)x.FK_inventory_id].Nombre,
                            Precio = inventarios[(int)x.FK_inventory_id].Precio,
                            Preparado = inventarios[(int)x.FK_inventory_id].Preparado
                        },
                        Status = new() { Id = 1, Nombre = "Anotado" },
                    }).ToArray(),
                };

                await transaction.CommitAsync();

                return new Response<CommandViewVM>(commandVM, "Ordenes registradas con éxito.");
             
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return new Response<CommandViewVM>(ex.Message);
            }
        }

        public async Task<Response<CommandUpdateStatusVM>> PedirTicket(int idCommand, int companyId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try 
            {
                List<OrdersInCommand> ordersInCommands = await _context.OrdersInCommands
                    .Include(c => c.Order)
                    .Include(c => c.Command)
                    .Where(x => x.Command.Restaurante == companyId
                                && x.Command.Fecha.Date == DateTime.Today
                                && x.Command.Id == idCommand
                                && x.Order.Status.Nombre == "Pedido listo")
                    .ToListAsync();
                var mesa = ordersInCommands.FirstOrDefault()?.Order.Mesa;

                if (ordersInCommands.Count == 0)
                {
                    throw new Exception("No existe la Comanda");
                }

                foreach (var item in ordersInCommands)
                {
                    Order order = item.Order;

                    order.FK_status_id = 4;

                    _context.Orders.Update(order);
                    await _context.SaveChangesAsync();
                }
                // Commit la transacción si todo es exitoso
                await transaction.CommitAsync();

                CommandUpdateStatusVM res = new()
                {
                    Id = idCommand,
                    Mesa = ordersInCommands.FirstOrDefault().Order.Mesa,
                    Status = 4
                };

                return new Response<CommandUpdateStatusVM>(res, "Se ha solicitado el ticket de cobro satisfactoriamente");
            }
            catch (Exception ex)
            {
                return new Response<CommandUpdateStatusVM>(ex.Message);
            }
        }
        public async Task<Response<CommandUpdateStatusVM>> CobrarComanda(int idCommand, int companyId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try 
            {
                List<OrdersInCommand> ordersInCommands = await _context.OrdersInCommands
                    .Include(c => c.Order)
                    .Include(c => c.Command)
                    .Where(x => x.Command.Restaurante == companyId
                                && x.Command.Fecha.Date == DateTime.Today
                                && x.Command.Id == idCommand
                                && x.Order.Status.Nombre == "Pagando")
                    .ToListAsync();

                if (ordersInCommands.Count == 0)
                {
                    throw new Exception("No existe la Comanda");
                }

                foreach (var item in ordersInCommands)
                {
                    Order order = item.Order;

                    order.FK_status_id = 6;

                    _context.Orders.Update(order);
                    await _context.SaveChangesAsync();
                }
                // Commit la transacción si todo es exitoso
                await transaction.CommitAsync();

                CommandUpdateStatusVM res = new()
                {
                    Id = idCommand,
                    Mesa = ordersInCommands.FirstOrDefault().Order.Mesa,
                    Status = 6
                };
                return new Response<CommandUpdateStatusVM>(res, "Se ha cobrado el comensal con éxito,");
            }
            catch (Exception ex)
            {
                return new Response<CommandUpdateStatusVM>(ex.Message);
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
