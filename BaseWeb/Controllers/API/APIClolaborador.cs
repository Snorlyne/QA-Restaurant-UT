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
    public class APIColaboradorController : ControllerBase
    {
        private readonly IColaboradorServicio _personServicio;
        public APIColaboradorController(IColaboradorServicio personServicio)
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
        [HttpGet("Id")]
        public async Task<IActionResult> ObtenerPorId(int Id)
        {
            var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
            var companyId = int.Parse(companyIdClaim.Value);
            var response = await _personServicio.ObtenerColaborador(Id, companyId);
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
        [HttpPut("Id")]
        public async Task<IActionResult> EditarColaborador([FromBody] ColaboradorCreate request, int Id)
        {
            var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
            var companyId = int.Parse(companyIdClaim.Value);
            var response = await _personServicio.EditarColaborador(request, Id, companyId);
            return Ok(response);
        }
        [HttpDelete("Id")]
        public async Task<IActionResult> EliminarColaborador(int Id)
        {
            var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
            var companyId = int.Parse(companyIdClaim.Value);
            var response = await _personServicio.EliminarColaborador(Id, companyId);
            return Ok(response);
        }

    }
}
