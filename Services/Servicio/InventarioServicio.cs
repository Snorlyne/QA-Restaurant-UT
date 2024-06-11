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

namespace Services.Servicio
{
    public class InventarioServicio : IInventarioServicio
    {
        private readonly ApplicationDbContext _context;
        public InventarioServicio(ApplicationDbContext context)
        {
            _context = context;
        }


        // Mostar Inventario   
        public async Task<Response<List<Inventario>>> ObtenerInventario()
        {
            try
            {
                List<Inventario> response = await _context.Inventario.ToListAsync();

                return new Response<List<Inventario>>(response);
            }
            catch (Exception ex)
            {
                throw new Exception("Sucedio un error" + ex.Message);
            }
        }

        // Crear Modal
        public async Task<Response<Inventario>> CrearProducto(InventarioVM request)
        {
            try
            {
                Inventario producto = new Inventario()
                {
                    ImagenInventario = request.ImagenInventario,
                    Nombre = request.Nombre,
                    Categoria = request.Categoria,
                    Descripcion = request.Descripcion,

                };

                _context.Inventario.Add(producto);
                await _context.SaveChangesAsync();

                return new Response<Inventario>(producto);

            }
            catch (Exception ex)
            {
                throw new Exception("Succedio un error " + ex.Message);
            }
        }

        public async Task<Response<Inventario>> ActualizarProducto(int id, InventarioVM inventario)
        {
            try
            {
                Inventario us = await _context.Inventario.FirstOrDefaultAsync(x => x.Id == id);

                if (us != null)
                {
                    us.ImagenInventario = inventario.ImagenInventario;
                    us.Nombre = inventario.Nombre;
                    us.Categoria = inventario.Categoria;
                    us.Descripcion = inventario.Descripcion;
                    _context.SaveChanges();
                }

                Inventario newProducto = new Inventario()
                {
                    ImagenInventario = inventario.ImagenInventario,
                    Nombre = inventario.Nombre,
                    Categoria = inventario.Categoria,
                    Descripcion = inventario.Descripcion,
                };

                _context.Inventario.Update(us);
                await _context.SaveChangesAsync();

                return new Response<Inventario>(newProducto);
            }
            catch (Exception ex)
            {
                throw new Exception("Sucedio un error al actualizar" + ex.Message);
            }
        }
        public async Task<Response<Inventario>> EliminarProducto(int id)
        {
            try
            {
                Inventario us = await _context.Inventario.FirstOrDefaultAsync(x => x.Id == id);
                if (us != null)
                {
                    _context.Inventario.Remove(us);
                    await _context.SaveChangesAsync();
                    return new Response<Inventario>("Modal eliminado:" + us.Descripcion.ToString());
                }

                return new Response<Inventario>("Modal no encontrado" + id);

            }
            catch (Exception ex)
            {
                throw new Exception("Error al eliminar" + ex.Message);
            }

        }
    }
}
