using Domain.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Services.IServicio;
using static Domain.ViewModels.OrderVM;

namespace BaseWeb.Controllers.API
{
    [ApiController]
    [Route("[controller]")]
    public class APIOrderController : ControllerBase
    {
        private readonly IOrderServicio _orderServicio;

        public APIOrderController(IOrderServicio orderServicio)
        {
            _orderServicio = orderServicio;
        }
        [HttpGet]
        public async Task<IActionResult> ObtenerListaOrders()
        {
            var response = await _orderServicio.ObtenerListaOrders();
            return Ok(response);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerOrderById(int id)
        {

            var response = await _orderServicio.ObtenerOrderById(id);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> CrearOrder([FromBody] OrderCreateVM request)
        {
            var response = await _orderServicio.CrearOrder(request);
            return Ok(response);
        }

        [HttpPut("id")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] OrderUpdateVM request)
        {
            var result = await _orderServicio.UpdateOrder(id, request);
            return Ok(result);
        }

        [HttpDelete("id")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var result = await _orderServicio.DeleteOrder(id);
            return Ok(result);
        }
    }
}
