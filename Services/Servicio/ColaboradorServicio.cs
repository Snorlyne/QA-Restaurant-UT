using Domain.Util;
using Repository.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Domain.ViewModels.PersonVM;

namespace Services.Servicio
{
    public class ColaboradorServicio
    {
        private readonly ApplicationDbContext _context;

        public ColaboradorServicio(ApplicationDbContext context)
        {
            _context = context;
        }

        //public async Task<Response<ColaboradorView>> ObtenerListaColaborador()
        //{
        //    try
        //    {

        //    }catch (Exception ex)
        //    {

        //    }
        //}
    }
}
