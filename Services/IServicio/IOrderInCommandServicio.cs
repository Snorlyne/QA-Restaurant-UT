using Domain.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Domain.ViewModels.OrderInCommandVM;

namespace Services.IServicio
{
    public interface IOrderInCommandServicio
    {
        public Task<Response<List<OrderInCommandViewVM>>> ObtenerListaOrderCommands();
    }
}
