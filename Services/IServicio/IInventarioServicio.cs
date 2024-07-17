using Domain.Entidades;
using Domain.Util;
using Domain.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;
using static Domain.ViewModels.InventarioVM;

namespace Services.IServicio
{
    public interface IInventarioServicio
    {
        Task<Response<List<ViewProductoVM>>> ObtenerInventario(int companyId);
        Task<Response<CreateProductoVM>> ObtenerProducto(int id, int companyId);
        Task<Response<Inventario>> CrearProducto(CreateProductoVM request, int companyId);
        Task<Response<Inventario>> ActualizarProducto(int id, CreateProductoVM modal);
        Task<Response<Inventario>> EliminarProducto(int id);
    }
}
