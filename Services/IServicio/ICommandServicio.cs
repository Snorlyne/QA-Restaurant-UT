using Domain.Util;
using Domain.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Domain.ViewModels.CommandVM;

namespace Services.IServicio
{
    public interface ICommandServicio
    {
        public Task<Response<List<CommandViewVM>>> ObtenerListaCommands();
    }
}
