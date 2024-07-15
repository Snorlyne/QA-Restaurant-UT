using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.IServicio;

namespace BaseWeb.Controllers.API
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(Roles = "Root")]
    public class RoleController : ControllerBase
    {
        private readonly IRoleServicio _roleServicio;

        public RoleController(IRoleServicio roleServicio)
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
