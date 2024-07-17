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
    public class ClienteController : ControllerBase
    {
        private readonly IClienteServicio _personServicio;
        public ClienteController(IClienteServicio personServicio)
        {
            _personServicio = personServicio;
        }
        [HttpGet("lista")]
        public async Task<IActionResult> ObtenerLista()
        {
            var response = await _personServicio.ObtenerListaCliente();
            return Ok(response);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var response = await _personServicio.ObtenerCliente(id);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> CrearCliente([FromBody] ClienteCreate request)
        {
            var response = await _personServicio.CrearCliente(request);
            return Ok(response);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> EditarCliente([FromBody] ClienteCreate request, int id)
        {
            var response = await _personServicio.EditarCliente(request, id);
            return Ok(response);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarCliente(int id)
        {
            var response = await _personServicio.EliminarCliente(id);
            return Ok(response);
        }

    }
    
}
