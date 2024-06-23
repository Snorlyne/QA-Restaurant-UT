using Domain.Entidades;
using Domain.Util;
using Domain.ViewModels;
using Microsoft.EntityFrameworkCore;
using Repository.Context;
using Services.IServicio;
using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Threading.Tasks;
using static Domain.ViewModels.InventarioVM;

namespace Services.Servicio
{
    public class CategoriaServicio : ICategoriaServicio
    {
        private readonly ApplicationDbContext _context;
        public CategoriaServicio(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Response<List<Categorias>>> ObtenerCategoria(int companyId)
        {
            try
            {
                List<Categorias> response = await _context.Categorias.Where(x=>x.FK_Company == companyId).ToListAsync();
                return new Response<List<Categorias>>(response);

            }
            catch (Exception ex)
            {
                throw new Exception("Sucedió un error: " + ex.Message, ex);
            }
        }

        public async Task<Response<ViewCategoriaVM>> ObtenerCategoriaById(int id, int companyId)
        {
            try
            {

                Categorias res = await _context.Categorias.Include(x => x.Company).FirstOrDefaultAsync(x => x.Id == id && x.Company.Id == companyId);
                if (res == null)
                {
                    throw new Exception("Categoria no encontrado");
                }

                ViewCategoriaVM catego = new()
                {
                    id = id,
                    NombreCategoria = res.NombreCategoria,

                };
                return new Response<ViewCategoriaVM>(catego);

            }
            catch (Exception ex)
            {
                throw new Exception("Sucedio un error" + ex.Message);
            }
        }


        public async Task<Response<Categorias>> CrearCategoria(CreateCategiaVM request, int companyId)
        {
            try
            {
                Categorias categorias = new Categorias()
                {
                    NombreCategoria = request.NombreCategoria,
                    FK_Company = companyId
                };

                _context.Categorias.Add(categorias);
                await _context.SaveChangesAsync();

                return new Response<Categorias>(categorias, "Categoria creado correctamente");
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException != null)
                {
                    throw new Exception("Sucedió un error: " + ex.InnerException.Message, ex.InnerException);
                }
                throw new Exception("Sucedió un error: " + ex.Message, ex);
            }
            catch (Exception ex)
            {
                throw new Exception("Sucedió un error: " + ex.Message, ex);
            }
        }

        public async Task<Response<Categorias>> ActualizarCategoria(int id, CreateCategiaVM categoria, int companyId)
        {
            try
            {
                Categorias us = await _context.Categorias.FirstOrDefaultAsync(x => x.Id == id && x.FK_Company == companyId);

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

                return new Response<Categorias>(newCategoria, "Categoria editado correctamente");
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException != null)
                {
                    throw new Exception("Sucedió un error al actualizar: " + ex.InnerException.Message, ex.InnerException);
                }
                throw new Exception("Sucedió un error al actualizar: " + ex.Message, ex);
            }
            catch (Exception ex)
            {
                throw new Exception("Sucedió un error al actualizar: " + ex.Message, ex);
            }
        }

        public async Task<Response<Categorias>> EliminarCategoria(int id, int companyId)
        {
            try
            {
                Categorias us = await _context.Categorias.FirstOrDefaultAsync(x => x.Id == id && x.FK_Company == companyId);
                if (us != null)
                {
                    _context.Categorias.Remove(us);
                    await _context.SaveChangesAsync();
                    return new Response<Categorias>(null, "Categoria eliminado: " + us.NombreCategoria);
                }

                return new Response<Categorias>("Categoria no encontrado: " + id);
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException != null)
                {
                    throw new Exception("Error al eliminar: " + ex.InnerException.Message, ex.InnerException);
                }
                throw new Exception("Error al eliminar: " + ex.Message, ex);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al eliminar: " + ex.Message, ex);
            }
        }
    }
}
