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
    public  interface IColaboradorServicio
    {
        Task<Response<List<ColaboradorView>>> ObtenerListaColaborador(int IdEmpresa);
        Task<Response<ColaboradorCreate>> CrearColaborador(ColaboradorCreate request, int IdEmpresa);
        Task<Response<ColaboradorCreate>> ObtenerColaborador(int Id, int IdEmpresa);
        Task<Response<ColaboradorCreate>> EditarColaborador(ColaboradorCreate request, int Id, int IdEmpresa);
        Task<Response<ClienteView>> EliminarColaborador(int Id, int IdEmpresa);

    }
}
