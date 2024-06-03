using Domain.Entidades;
using Domain.Util;
using Domain.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Domain.ViewModels.CompanyVM;

namespace Services.IServicio
{
    public interface ICompanyServicio
    {
        Task<Response<List<CompanyView>>> ObtenerListaCompany();
        Task<Response<CompanyView>> ObtenerCompany(int Id);
        Task<Response<Company>> CrearCompany(CompanyCreate request);
        Task<Response<Company>> EditarCompany(CompanyCreate request, int Id);
        Task<Response<Company>> EliminarCompany(int Id);
    }
}
