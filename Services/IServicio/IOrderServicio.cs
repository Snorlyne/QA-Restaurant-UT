using Domain.Entidades;
using Domain.Util;
using Domain.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Domain.ViewModels.OrderVM;

namespace Services.IServicio
{
    public interface IOrderServicio
    {
        public Task<Response<List<OrderViewVM>>> ObtenerListaOrders();
        public Task<Response<OrderVM.OrderViewVM>> ObtenerOrderById(int id);
        public Task<Response<Order>> CrearOrder(OrderCreateVM request);
        //public Task<Response<OrderVM.OrderViewVM>> UpdateOrder(int id, OrderVM.OrderUpdateVM request);
        public Task<Response<Order>> DeleteOrder(int id);
    }
}
