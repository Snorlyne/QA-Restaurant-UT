using Domain.Util;
using Domain.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.IServicio
{
    public interface IVentasServicio
    {
        Task<Response<List<VentasVM>>> ObtenerVentasPorAnio(int companyId);

    }
}
