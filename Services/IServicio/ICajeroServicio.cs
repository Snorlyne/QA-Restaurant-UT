using Domain.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Domain.ViewModels.CajeroVM;

namespace Services.IServicio
{
    public interface ICajeroServicio
    {
       Task<Response<List<ViewComandasVM>>> ObtenerComandas(int companyId);
    }
}
