using Domain.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.IServicio;

namespace BaseWeb.Controllers.API
{
    [ApiController]
    [Authorize(Roles = "Root")]
    [Route("[controller]")]
    public class APICategoriaController : ControllerBase
    {

        private readonly ICategoriaServicio _categoriaService;

        public APICategoriaController(ICategoriaServicio categoriaService)
        {
            _categoriaService = categoriaService;
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerLista()
        {
            var result = await _categoriaService.ObtenerCategoria();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] CategoriaVM request)
        {
            var result = await _categoriaService.CrearCategoria(request);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] CategoriaVM inventario)
        {
            var result = await _categoriaService.ActualizarCategoria(id, inventario);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var result = await _categoriaService.EliminarCategoria(id);
            return Ok(result);
        }


    }
}
