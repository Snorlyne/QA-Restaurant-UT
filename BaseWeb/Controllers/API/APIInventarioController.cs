using Domain.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.IServicio;
using System.Threading.Tasks;

namespace BaseWeb.Controllers.API
{
    [ApiController]
    [Authorize(Roles = "Root")]
    [Route("[controller]")]
    public class APIInventarioController : ControllerBase
    {
        private readonly IInventarioServicio _inventarioService;

        public APIInventarioController(IInventarioServicio inventarioService)
        {
            _inventarioService = inventarioService;
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerLista()
        {
            var result = await _inventarioService.ObtenerInventario();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] InventarioVM request)
        {
            var result = await _inventarioService.CrearProducto(request);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] InventarioVM inventario)
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
