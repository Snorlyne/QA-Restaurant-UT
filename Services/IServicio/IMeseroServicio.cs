using Domain.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Domain.ViewModels.CommandVM;
using static Domain.ViewModels.MeseroVM;

namespace Services.IServicio
{
    public interface IMeseroServicio
    {
        Task<Response<List<ViewComandasMeseroVM>>> ObtenerComandas(int personId, int companyId);
        Task<Response<CommandViewVM>> CrearComandaYOrdenes(int idPerson, int companyId, CommandCreateVM req);
        Task<Response<CommandUpdateStatusVM>> CobrarComanda(int idCommand, int companyId);
        Task<Response<CommandUpdateStatusVM>> PedirTicket(int idCommand, int companyId);
    }
}
