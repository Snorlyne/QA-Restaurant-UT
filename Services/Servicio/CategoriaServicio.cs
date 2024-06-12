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
    public class CategoriaServicio : ICategoriaServicio 
    {
        private readonly ApplicationDbContext _context;
        public CategoriaServicio(ApplicationDbContext context)
        {
            _context = context;
        }


        // Mostar Categoria   
        public async Task<Response<List<Categorias>>> ObtenerCategoria()
        {
            try
            {
                List<Categorias> response = await _context.Categorias.ToListAsync();

                return new Response<List<Categorias>>(response);
            }
            catch (Exception ex)
            {
                throw new Exception("Sucedio un error" + ex.Message);
            }
        }

        // Crear Categoria
        public async Task<Response<Categorias>> CrearCategoria(CategoriaVM request)
        {
            try
            {
                Categorias categorias = new Categorias()
                {
                   NombreCategoria = request.NombreCategoria,

                };

                _context.Categorias.Add(categorias);
                await _context.SaveChangesAsync();

                return new Response<Categorias>(categorias);

            }
            catch (Exception ex)
            {
                throw new Exception("Succedio un error " + ex.Message);
            }
        }

        // Actualizar Categoria

        public async Task<Response<Categorias>> ActualizarCategoria(int id, CategoriaVM categoria)
        {
            try
            {
                Categorias us = await _context.Categorias.FirstOrDefaultAsync(x => x.Id == id);

                if (us != null)
                {
                    us.NombreCategoria = categoria.NombreCategoria;
                    _context.SaveChanges();
                }

                Categorias newCategoria = new Categorias()
                {
                    NombreCategoria = categoria.NombreCategoria
                };

                _context.Categorias.Update(us);
                await _context.SaveChangesAsync();

                return new Response<Categorias>(newCategoria);
            }
            catch (Exception ex)
            {
                throw new Exception("Sucedio un error al actualizar" + ex.Message);
            }
        }

        // Eliminar Categoria

        public async Task<Response<Categorias>> EliminarCategoria(int id)
        {
            try
            {
                Categorias us = await _context.Categorias.FirstOrDefaultAsync(x => x.Id == id);
                if (us != null)
                {
                    _context.Categorias.Remove(us);
                    await _context.SaveChangesAsync();
                    return new Response<Categorias>("Modal eliminado:" + us.NombreCategoria.ToString());
                }

                return new Response<Categorias>("Modal no encontrado" + id);

            }
            catch (Exception ex)
            {
                throw new Exception("Error al eliminar" + ex.Message);
            }

        }


    }
}
