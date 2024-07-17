using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.IServicio;

namespace BaseWeb.Controllers.API
{
    [ApiController]
    [Authorize(Roles = "Admin")]
    [Route("[controller]")]

    public class VentasController : ControllerBase
    {
        private readonly IVentasServicio _ventasServicios;

        public VentasController(IVentasServicio ventasServicios)
        {
            _ventasServicios = ventasServicios;
        }

        [HttpGet("PerYear")]
        public async Task<IActionResult> ObtenerLista()
        {
          var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
          var companyId = int.Parse(companyIdClaim.Value);
          var result = await _ventasServicios.ObtenerVentasPorAnio(companyId);
          return Ok(result);
        }
    }
}
