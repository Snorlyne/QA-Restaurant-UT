using Domain.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.IServicio;
using Services.Servicio;
using static Domain.ViewModels.AuthVM;
using static Domain.ViewModels.CompanyVM;

namespace BaseWeb.Controllers.API
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(Roles = "Root")]
    public class APICompanyController : ControllerBase
    {
        private readonly ICompanyServicio _companyServicio;
        public APICompanyController(ICompanyServicio companyServicio) 
        {
            _companyServicio = companyServicio;
        }

        [HttpGet("lista")]
        public async Task<IActionResult> ObtenerLista()
        {
            var response = await _companyServicio.ObtenerListaCompany();
            return Ok(response);
        }
        [HttpGet("Id")]
        public async Task<IActionResult> ObtenerPorId(int Id)
        {
            var response = await _companyServicio.ObtenerCompany(Id);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> Crear(CompanyCreate request)
        {
            var response = await _companyServicio.CrearCompany(request);
            return Ok(response);
        }
        [HttpPut("Id")]
        public async Task<IActionResult> Editar(CompanyCreate request, int Id)
        {
            var response = await _companyServicio.EditarCompany(request, Id);
            return Ok(response);
        }

        [HttpDelete("Id")]
        public async Task<IActionResult> Eliminar(int Id)
        {
            var response = await _companyServicio.EliminarCompany(Id);
            return Ok(response);
        }
    }
}
