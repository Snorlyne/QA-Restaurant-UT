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
        public Task<Response<List<Categorias>>> ObtenerCategoria(int companyId);
        public Task<Response<ViewCategoriaVM>> ObtenerCategoriaById(int id, int companyId);
        public Task<Response<Categorias>> CrearCategoria(CreateCategiaVM request, int companyId);
        public Task<Response<Categorias>> ActualizarCategoria(int id, CreateCategiaVM categoria, int companyId);
        public Task<Response<Categorias>> EliminarCategoria(int id, int companyId);




    }
}
