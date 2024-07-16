using Domain.Entidades;
using Domain.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Domain.ViewModels.CajeroVM;
using static Domain.ViewModels.CommandVM;

namespace Services.IServicio
{
    public interface ICajeroServicio
    {
       Task<Response<List<ViewComandasCajaVM>>> ObtenerComandas(int companyId);
       Task<Response<CommandUpdateStatusVM>> GenerarTicketDeCobro(int idCommand, int idPerson, int companyId);
       Task<Response<Command>> EliminarComanda(int idCommand, int companyId);
       Task<Response<CommandOrderDeleteVM>> EliminarOrden(int idOrden, int companyId);
    }
}
