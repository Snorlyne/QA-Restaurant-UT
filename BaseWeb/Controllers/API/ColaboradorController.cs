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
    [Authorize(Roles = "Admin")]
    public class ColaboradorController : ControllerBase
    {
        private readonly IColaboradorServicio _personServicio;
        public ColaboradorController(IColaboradorServicio personServicio)
        {
            _personServicio = personServicio;
        }
        [HttpGet("lista")]
        public async Task<IActionResult> ObtenerLista()
        {
            var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
            var companyId = int.Parse(companyIdClaim.Value);
            var response = await _personServicio.ObtenerListaColaborador(companyId);
            return Ok(response);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
            var companyId = int.Parse(companyIdClaim.Value);
            var response = await _personServicio.ObtenerColaborador(id, companyId);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> CrearColaborador([FromBody] ColaboradorCreate request)
        {
            var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
            var companyId = int.Parse(companyIdClaim.Value);
            var response = await _personServicio.CrearColaborador(request, companyId);
            return Ok(response);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> EditarColaborador([FromBody] ColaboradorCreate request, int id)
        {
            var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
            var companyId = int.Parse(companyIdClaim.Value);
            var response = await _personServicio.EditarColaborador(request, id, companyId);
            return Ok(response);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarColaborador(int id)
        {
            var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
            var companyId = int.Parse(companyIdClaim.Value);
            var response = await _personServicio.EliminarColaborador(id, companyId);
            return Ok(response);
        }

    }
}
