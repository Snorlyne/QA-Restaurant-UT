using Microsoft.AspNetCore.Mvc;
using Services.IServicio;

namespace BaseWeb.Controllers.API
{
    [ApiController]
    [Route("[controller]")]
    public class APICommandController : ControllerBase
    {
        private readonly ICommandServicio _commandServicio;

        public APICommandController(ICommandServicio commandServicio)
        {
            _commandServicio = commandServicio;
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerListaCommands()
        {
            var response = await _commandServicio.ObtenerListaCommands();
            return Ok(response);
        }
    }
}
