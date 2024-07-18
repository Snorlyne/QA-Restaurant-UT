using Domain.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.IServicio;
using System.Threading.Tasks;

namespace BaseWeb.Controllers.API
{
    [ApiController]
    [Authorize(Roles = "Admin, Waiter")]
    [Route("[controller]")]
    public class CategoriaController : ControllerBase
    {
        private readonly ICategoriaServicio _categoriaService;

        public CategoriaController(ICategoriaServicio categoriaService)
        {
            _categoriaService = categoriaService;
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerLista()
        {
            try
            {
                var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
                var companyId = int.Parse(companyIdClaim.Value);
                var result = await _categoriaService.ObtenerCategoria(companyId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
            var companyId = int.Parse(companyIdClaim.Value);
            var response = await _categoriaService.ObtenerCategoriaById(id, companyId);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] CreateCategiaVM request)
        {
            try
            {
                var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
                var companyId = int.Parse(companyIdClaim.Value);
                var result = await _categoriaService.CrearCategoria(request, companyId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] CreateCategiaVM request)
        {
            try
            {
                var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
                var companyId = int.Parse(companyIdClaim.Value);
                var result = await _categoriaService.ActualizarCategoria(id, request, companyId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            try
            {
                var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
                var companyId = int.Parse(companyIdClaim.Value);
                var result = await _categoriaService.EliminarCategoria(id, companyId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
