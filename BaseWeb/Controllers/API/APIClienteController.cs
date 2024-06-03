using Domain.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.IServicio;
using Services.Servicio;
using static Domain.ViewModels.PersonVM;

namespace BaseWeb.Controllers.API
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(Roles = "Root")]
    public class APIClienteController : ControllerBase
    {
        private readonly IClienteServicio _personServicio;
        public APIClienteController(IClienteServicio personServicio)
        {
            _personServicio = personServicio;
        }
        [HttpGet("lista")]
        public async Task<IActionResult> ObtenerLista()
        {
            var response = await _personServicio.ObtenerListaCliente();
            return Ok(response);
        }
        [HttpGet("Id")]
        public async Task<IActionResult> ObtenerPorId(int Id)
        {
            var response = await _personServicio.ObtenerCliente(Id);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> CrearCliente([FromBody] ClienteCreate request)
        {
            var response = await _personServicio.CrearCliente(request);
            return Ok(response);
        }
        [HttpPut("Id")]
        public async Task<IActionResult> CrearCliente([FromBody] ClienteCreate request, int Id)
        {
            var response = await _personServicio.EditarCliente(request, Id);
            return Ok(response);
        }
        [HttpDelete]
        public async Task<IActionResult> CrearCliente(int Id)
        {
            var response = await _personServicio.EliminarCliente(Id);
            return Ok(response);
        }
    }
}
