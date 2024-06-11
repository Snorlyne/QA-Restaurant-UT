using Domain.Entidades;
using Domain.Util;
using Domain.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Services.IServicio
{
    public interface IInventarioServicio
    {
        Task<Response<List<Inventario>>> ObtenerInventario();
        Task<Response<Inventario>> CrearProducto(InventarioVM request);
        Task<Response<Inventario>> ActualizarProducto(int id, InventarioVM modal);
        Task<Response<Inventario>> EliminarProducto(int id);
    }
}
