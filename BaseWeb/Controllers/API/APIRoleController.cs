using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.IServicio;

namespace BaseWeb.Controllers.API
{
    [Route("[controller]")]
    [ApiController]
    public class APIRoleController : ControllerBase
    {
        private readonly IRoleServicio _roleServicio;

        public APIRoleController(IRoleServicio roleServicio)
        {
            _roleServicio = roleServicio;
        }
        [HttpGet("lista")]
        public async Task<IActionResult> ObtenerLista()
        {
            var response = await _roleServicio.ObtenerLista();
            return Ok(response);
        }
    }
}
