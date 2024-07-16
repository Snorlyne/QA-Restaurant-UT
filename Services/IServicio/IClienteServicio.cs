using Domain.Entidades;
using Domain.Util;
using Domain.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Domain.ViewModels.PersonVM;

namespace Services.IServicio
{
    public interface IClienteServicio
    {
        Task<Response<List<ClienteView>>> ObtenerListaCliente();
        Task<Response<ClienteCreate>> ObtenerCliente(int Id);
        Task<Response<ClienteCreate>> CrearCliente(ClienteCreate request);
        Task<Response<ClienteCreate>> EditarCliente(ClienteCreate request, int Id);
        Task<Response<ClienteView>> EliminarCliente(int Id);
    }
}
