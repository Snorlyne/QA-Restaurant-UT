using Domain.Entidades;
using Domain.Util;
using Domain.ViewModels;
using Microsoft.EntityFrameworkCore;
using Repository.Context;
using Services.IServicio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static Domain.ViewModels.InventarioVM;
using static Domain.ViewModels.PersonVM;

namespace Services.Servicio
{
    public class InventarioServicio : IInventarioServicio
    {
        private readonly ApplicationDbContext _context;

        public InventarioServicio(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Response<List<ViewProductoVM>>> ObtenerInventario(int companyId)
        {
            try
            {
                List<ViewProductoVM> response = await _context.Inventario
                    .Include(x => x.Categorias)
                    .Where(c => c.Categorias.FK_Company == companyId)
                    .Select(c => new ViewProductoVM
                    {
                        Id = c.Id, 
                        Categoria = c.Categorias.NombreCategoria,
                        Descripcion = c.Descripcion,
                        Nombre = c.Nombre,
                        Precio = c.Precio,
                        Preparado = c.Preparado,
                        ImagenInventario = c.ImagenInventario != null ? "data:image/png;base64," + Convert.ToBase64String(c.ImagenInventario) : null,
                    })
                    .ToListAsync();

                return new Response<List<ViewProductoVM>>(response);
            }
            catch (Exception ex)
            {
                throw new Exception("Ocurrió un error al obtener el inventario: " + ex.Message);
            }
        }

        public async Task<Response<CreateProductoVM>> ObtenerProducto(int id, int companyId)
        {
            try
            {
                Inventario res = await _context.Inventario.Include(x => x.Categorias).FirstOrDefaultAsync(x => x.Id == id && x.Categorias.FK_Company == companyId);
                if (res == null)
                {
                    throw new Exception("Producto no encontrado");
                }
                string? base64String = res.ImagenInventario != null
                   ? Convert.ToBase64String(res.ImagenInventario)
                   : null;
                CreateProductoVM produc = new()
                {
                    Nombre = res.Nombre,
                    Precio = res.Precio,
                    Preparado = res.Preparado,
                    Categoria = (int)res.FK_Categoria,
                    Descripcion = res.Descripcion,
                    ImagenInventario = res.ImagenInventario != null ? "data:image/png;base64," + base64String : null,

                };
                return new Response<CreateProductoVM>(produc);

            }
            catch (Exception ex)
            {
                throw new Exception("Sucedio un error" + ex.Message);
            }
        }

        public async Task<Response<Inventario>> CrearProducto(CreateProductoVM request, int companyId)
        {
            try
            {
                string cleanBase64 = ExtractBase64FromImage(request.ImagenInventario);

                Inventario producto = new Inventario()
                {
                    
                    Nombre = request.Nombre,
                    Descripcion = request.Descripcion,
                    ImagenInventario = !string.IsNullOrEmpty(cleanBase64)
                        ? Convert.FromBase64String(cleanBase64)
                        : null,
                    FK_Categoria = request.Categoria,
                    Precio = request.Precio,
                    Preparado = request.Preparado,
                };

                _context.Inventario.Add(producto);
                await _context.SaveChangesAsync();

                return new Response<Inventario>(producto, "Producto registrado con exito");
            }
            catch (Exception ex)
            {
                throw new Exception("Ocurrió un error al crear el producto: " + ex.Message);
            }
        }

        public async Task<Response<Inventario>> ActualizarProducto(int id, CreateProductoVM inventario)
        {
            try
            {
                Inventario producto = await _context.Inventario.FirstOrDefaultAsync(x => x.Id == id);

                if (producto != null)
                {
                    string cleanBase64 = ExtractBase64FromImage(inventario.ImagenInventario);

                    producto.Nombre = inventario.Nombre;
                    producto.Descripcion = inventario.Descripcion;
                    producto.ImagenInventario = !string.IsNullOrEmpty(cleanBase64)
                        ? Convert.FromBase64String(cleanBase64)
                        : null;
                    producto.Precio = inventario.Precio;
                    producto.Preparado = inventario.Preparado;

                    _context.Inventario.Update(producto);
                    await _context.SaveChangesAsync();

                    return new Response<Inventario>(producto, "Producto editado correctamente");
                }

                throw new Exception($"No se encontró el producto con Id {id}");
            }
            catch (Exception ex)
            {
                throw new Exception("Ocurrió un error al actualizar el producto: " + ex.Message);
            }
        }

        public async Task<Response<Inventario>> EliminarProducto(int id)
        {
            try
            {
                Inventario producto = await _context.Inventario.FirstOrDefaultAsync(x => x.Id == id);

                if (producto != null)
                {
                    _context.Inventario.Remove(producto);
                    await _context.SaveChangesAsync();
                    return new Response<Inventario>(producto, $"Producto eliminado: {producto.Descripcion}");
                }

                throw new Exception($"No se encontró el producto con Id {id}");
            }
            catch (Exception ex)
            {
                throw new Exception("Ocurrió un error al eliminar el producto: " + ex.Message);
            }
        }

        // Método para extraer la base64 de la imagen
        private string ExtractBase64FromImage(string imagen)
        {
            if (!string.IsNullOrEmpty(imagen) && imagen.Split(',').Length > 1)
            {
                return imagen.Split(',')[1];
            }

            return null;
        }
    }
}
