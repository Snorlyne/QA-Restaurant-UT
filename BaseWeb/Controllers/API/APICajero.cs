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
    //[Authorize(Roles = "Admin")]
    public class APICajero : ControllerBase
    {
        private readonly ICajeroServicio _cajeroServicio;
        public APICajero(ICajeroServicio cajeroServicio)
        {
            _cajeroServicio = cajeroServicio;
        }
        [HttpGet("Comandas")]
        public async Task<IActionResult> Comandas()
        {
            var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
            var companyId = int.Parse(companyIdClaim.Value);
            var response = await _cajeroServicio.ObtenerComandas(companyId);
            return Ok(response);
        }
        //[HttpGet("Id")]
        //public async Task<IActionResult> ObtenerPorId(int Id)
        //{
        //    var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
        //    var companyId = int.Parse(companyIdClaim.Value);
        //    var response = await _personServicio.ObtenerColaborador(Id, companyId);
        //    return Ok(response);
        //}
        //[HttpPost]
        //public async Task<IActionResult> CrearColaborador([FromBody] ColaboradorCreate request)
        //{
        //    var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
        //    var companyId = int.Parse(companyIdClaim.Value);
        //    var response = await _personServicio.CrearColaborador(request, companyId);
        //    return Ok(response);
        //}
        //[HttpPut("Id")]
        //public async Task<IActionResult> EditarColaborador([FromBody] ColaboradorCreate request, int Id)
        //{
        //    var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
        //    var companyId = int.Parse(companyIdClaim.Value);
        //    var response = await _personServicio.EditarColaborador(request, Id, companyId);
        //    return Ok(response);
        //}
        //[HttpDelete("Id")]
        //public async Task<IActionResult> EliminarColaborador(int Id)
        //{
        //    var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
        //    var companyId = int.Parse(companyIdClaim.Value);
        //    var response = await _personServicio.EliminarColaborador(Id, companyId);
        //    return Ok(response);
        //}
    }
}
