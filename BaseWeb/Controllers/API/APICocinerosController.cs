using Domain.Util;
using Domain.DTOs;
using Microsoft.AspNetCore.Mvc;
using Services.IServicio;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class APICocinerosController : ControllerBase
    {
        private readonly ICocinerosServicio _cocinerosServicio;

        public APICocinerosController(ICocinerosServicio cocinerosServicio)
        {
            _cocinerosServicio = cocinerosServicio;
        }

        [HttpGet("ObtenerOrdenes")]
        public async Task<IActionResult> ObtenerOrdenes()
        {
            var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
            if (companyIdClaim == null)
            {
                return BadRequest(new { isSuccess = false, message = "CompanyId claim not found." });
            }

            if (!int.TryParse(companyIdClaim.Value, out int companyId))
            {
                return BadRequest(new { isSuccess = false, message = "Invalid CompanyId claim value." });
            }

            var result = await _cocinerosServicio.ObtenerOrdenes(companyId);
            return Ok(result);
        }

        [HttpPut("ActualizarEstadoOrden/{ordenId}")]
        public async Task<ActionResult<Response<bool>>> ActualizarEstadoOrden(int ordenId, [FromBody] ActualizarEstadoRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.NuevoEstado))
            {
                return BadRequest(new Response<bool> { IsSuccess = false, Message = "El campo nuevoEstado es requerido." });
            }

            var response = await _cocinerosServicio.ActualizarEstadoOrden(ordenId, request.NuevoEstado);
            if (response.IsSuccess)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }
    }

    public class ActualizarEstadoRequest
    {
        public string NuevoEstado { get; set; }
    }
}
