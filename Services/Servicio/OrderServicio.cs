using Domain.Entidades;
using Domain.Util;
using Domain.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using Repository.Context;
using Services.IServicio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Domain.ViewModels.InventarioVM;
using static Domain.ViewModels.OrderVM;
using static Domain.ViewModels.PersonVM;
using static Domain.ViewModels.StatusVM;

namespace Services.Servicio
{
    public class OrderServicio : IOrderServicio
    {
        private readonly ApplicationDbContext _context;

        public OrderServicio(ApplicationDbContext context)
        {
            _context = context;
        }

        public Task<Response<Order>> CrearOrder(OrderCreateVM request)
        {
            throw new NotImplementedException();
        }

        //public async Task<Response<List<OrderViewVM>>> ObtenerListaOrders()
        //{
        //    try
        //    {
        //        List<OrderViewVM> view = await _context.Orders
        //            .Include(s => s.Status)
        //            .Include(p => p.Person)
        //            .Include(iv => iv.Inventario)
        //            .Select(c => new OrderViewVM
        //            {
        //                Id = c.Id,
        //                Mesa = c.Mesa,
        //                Fecha = c.Fecha,
        //                Adicional = c.Adicional,
        //                Status = new()
        //                {
        //                    Id = c.Status.Id,
        //                    Nombre = c.Status.Nombre
        //                },
        //            })
        //            .ToListAsync();

        //        return new Response<List<OrderViewVM>>(view);
        //    }
        //    catch (Exception ex)
        //    {
        //        return new Response<List<OrderViewVM>>(ex.Message);
        //    }
        //}

        //public async Task<Response<OrderVM.OrderViewVM>> ObtenerOrderById(int id)
        //{
        //    try
        //    {
        //        var order = await _context.Orders
        //            .Include(s => s.Status)
        //            .Include(p => p.Person)
        //            .Include(iv => iv.Inventario)
        //            .Where(c => c.Id == id)
        //            .Select(c => new OrderVM.OrderViewVM
        //            {
        //                Id = c.Id,
        //                Mesa = c.Mesa,
        //                Fecha = c.Fecha,
        //                Adicional = c.Adicional,
        //                Status = new()
        //                {
        //                    Id = c.Status.Id,
        //                    Nombre = c.Status.Nombre
        //                },
        //                Person = new()
        //                {
        //                    Id = c.Person.Id,
        //                    Nombre = c.Person.Nombre
        //                },
        //                Inventario = new()
        //                {
        //                    Id = c.Inventario.Id,
        //                    Nombre = c.Inventario.Nombre
        //                }
        //            })
        //            .FirstOrDefaultAsync();

        //        if (order == null)
        //        {
        //            return new Response<OrderVM.OrderViewVM>("Orden no encontrada");
        //        }

        //        return new Response<OrderVM.OrderViewVM>(order);
        //    }
        //    catch (Exception ex)
        //    {
        //        return new Response<OrderVM.OrderViewVM>(ex.Message);
        //    }
        //}

        //public async Task<Response<Order>> CrearOrder (OrderVM.OrderCreateVM request, int personId)
        //{
        //    try
        //    {
        //        Order newOrder = new()
        //        {
        //            Mesa = request.Mesa,
        //            Fecha = request.Fecha,
        //            Adicional = request.Adicional,
        //            FK_person_id = personId,
        //            FK_status_id = request.FK_status_id,
        //            FK_inventory_id = request.FK_inventory_id,
        //        };
        //        _context.Orders.Add(newOrder);
        //        await _context.SaveChangesAsync();

        //        var orderWithNavigationProperties = await _context.Orders
        //       .Include(o => o.Status)
        //       .Include(o => o.Inventario)
        //       .FirstOrDefaultAsync(o => o.Id == newOrder.Id);

        //        var orderViewVM = new OrderVM.OrderViewVM
        //        {
        //            Id = orderWithNavigationProperties.Id,
        //            Mesa = orderWithNavigationProperties.Mesa,
        //            Fecha = orderWithNavigationProperties.Fecha,
        //            Adicional = orderWithNavigationProperties.Adicional,
        //            Status = new()
        //            {
        //                Id = orderWithNavigationProperties.Status.Id,
        //                Nombre = orderWithNavigationProperties.Status.Nombre
        //            },
        //            Inventario = new()
        //            {
        //                Id = orderWithNavigationProperties.Inventario.Id,
        //                Nombre = orderWithNavigationProperties.Inventario.Nombre
        //            }
        //        };

        //        return new Response<Order>(orderWithNavigationProperties, "Registro exitoso");
        //    }
        //    catch (Exception ex)
        //    {
        //        return new Response<Order>(ex.Message);
        //    }
        //}

        //public async Task<Response<OrderVM.OrderViewVM>> UpdateOrder(int id, OrderVM.OrderUpdateVM request)
        //{
        //    try
        //    {
        //        var orderToUpdate = await _context.Orders.FindAsync(id);
        //        if (orderToUpdate == null)
        //        {
        //            return new Response<OrderVM.OrderViewVM>("Orden no encontrada");
        //        }

        //        orderToUpdate.Mesa = request.Mesa;
        //        orderToUpdate.Fecha = request.Fecha;
        //        orderToUpdate.Adicional = request.Adicional;
        //        orderToUpdate.FK_status_id = request.FK_status_id;
        //        orderToUpdate.FK_person_id = request.FK_person_id;
        //        orderToUpdate.FK_inventory_id = request.FK_inventory_id;

        //        _context.Orders.Update(orderToUpdate);
        //        await _context.SaveChangesAsync();

        //        var orderWithNavigationProperties = await _context.Orders
        //            .Include(o => o.Person)
        //            .Include(o => o.Status)
        //            .Include(o => o.Inventario)
        //            .FirstOrDefaultAsync(o => o.Id == orderToUpdate.Id);

        //        var orderViewVM = new OrderVM.OrderViewVM
        //        {
        //            Id = orderWithNavigationProperties.Id,
        //            Mesa = orderWithNavigationProperties.Mesa,
        //            Fecha = orderWithNavigationProperties.Fecha,
        //            Adicional = orderWithNavigationProperties.Adicional,
        //            Status = new()
        //            {
        //                Id = orderWithNavigationProperties.Status.Id,
        //                Nombre = orderWithNavigationProperties.Status.Nombre
        //            },
        //            Person = new()
        //            {
        //                Id = orderWithNavigationProperties.Person.Id,
        //                Nombre = orderWithNavigationProperties.Person.Nombre
        //            },
        //            Inventario = new()
        //            {
        //                Id = orderWithNavigationProperties.Inventario.Id,
        //                Nombre = orderWithNavigationProperties.Inventario.Nombre
        //            }
        //        };

        //        return new Response<OrderVM.OrderViewVM>(orderViewVM, "Actualización exitosa");
        //    }
        //    catch (Exception ex)
        //    {
        //        return new Response<OrderVM.OrderViewVM>(ex.Message);
        //    }
        //}
        public async Task<Response<Order>> DeleteOrder(int id)
        {
            try
            {
                Order order = await _context.Orders.FirstOrDefaultAsync(x => x.Id == id);

                if (order != null)
                {
                    _context.Orders.Remove(order);
                    await _context.SaveChangesAsync();
                    return new Response<Order>(order, $"Orden eliminada: {order.Id}");
                }

                throw new Exception($"No se encontró la orden con Id {id}");
            }
            catch (Exception ex)
            {
                throw new Exception("Ocurrió un error al eliminar la orden: " + ex.Message);
            }
        }

        public Task<Response<List<OrderViewVM>>> ObtenerListaOrders()
        {
            throw new NotImplementedException();
        }

        public Task<Response<OrderViewVM>> ObtenerOrderById(int id)
        {
            throw new NotImplementedException();
        }
    }
}
