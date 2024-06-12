using Domain.Entidades;
using Domain.Util;
using Domain.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServicio
{
    public interface ICategoriaServicio
    {
        public Task<Response<List<Categorias>>> ObtenerCategoria();
        public Task<Response<Categorias>> CrearCategoria(CategoriaVM request);
        public Task<Response<Categorias>> ActualizarCategoria(int id, CategoriaVM categoria);
        public Task<Response<Categorias>> EliminarCategoria(int id);




    }
}
