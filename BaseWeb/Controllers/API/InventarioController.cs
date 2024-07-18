using Domain.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.IServicio;
using System.Threading.Tasks;
using static Domain.ViewModels.InventarioVM;

namespace BaseWeb.Controllers.API
{
    [ApiController]
    [Authorize(Roles = "Admin, Waiter")]
    [Route("[controller]")]
    public class InventarioController : ControllerBase
    {
        private readonly IInventarioServicio _inventarioService;

        public InventarioController(IInventarioServicio inventarioService)
        {
            _inventarioService = inventarioService;
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerLista()
        {
            var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
            var companyId = int.Parse(companyIdClaim.Value);
            var result = await _inventarioService.ObtenerInventario(companyId);
            return Ok(result);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerPorId(int Id)
        {
            var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
            var companyId = int.Parse(companyIdClaim.Value);
            var response = await _inventarioService.ObtenerProducto(Id, companyId);
            return Ok(response);
        }


        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] CreateProductoVM request)
        {
            var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
            var companyId = int.Parse(companyIdClaim.Value);
            var result = await _inventarioService.CrearProducto(request, companyId);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] CreateProductoVM inventario)
        {
            var result = await _inventarioService.ActualizarProducto(id, inventario);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var result = await _inventarioService.EliminarProducto(id);
            return Ok(result);
        }
    }
}
