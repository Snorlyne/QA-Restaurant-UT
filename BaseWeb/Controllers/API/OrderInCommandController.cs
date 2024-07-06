using Microsoft.AspNetCore.Mvc;
using Services.IServicio;

namespace BaseWeb.Controllers.API
{
    [ApiController]
    [Route("[controller]")]
    public class OrderInCommandController : ControllerBase
    {
        private readonly IOrderInCommandServicio _orderInCommandServicio;

        public OrderInCommandController(IOrderInCommandServicio orderInCommandServicio)
        {
            _orderInCommandServicio = orderInCommandServicio;
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerListaOrderCommands()
        {
            var response = await _orderInCommandServicio.ObtenerListaOrderCommands();
            return Ok(response);
        }
    }
}
