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
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyServicio _companyServicio;
        public CompanyController(ICompanyServicio companyServicio) 
        {
            _companyServicio = companyServicio;
        }

        [HttpGet("lista")]
        public async Task<IActionResult> ObtenerLista()
        {
            var response = await _companyServicio.ObtenerListaCompany();
            return Ok(response);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var response = await _companyServicio.ObtenerCompany(id);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> Crear(CompanyCreate request)
        {
            var response = await _companyServicio.CrearCompany(request);
            return Ok(response);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Editar(CompanyCreate request, int id)
        {
            var response = await _companyServicio.EditarCompany(request, id);
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var response = await _companyServicio.EliminarCompany(id);
            return Ok(response);
        }
    }
}
