using Domain.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Domain.ViewModels.StatusVM;

namespace Services.IServicio
{
    public interface IStatusServicio
    {
        Task<Response<List<StatusView>>> ObtenerLista();
    }
}
