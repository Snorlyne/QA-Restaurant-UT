using Domain.Util;
using Domain.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.IServicio;
using static Domain.ViewModels.OrderVM;

namespace BaseWeb.Controllers.API
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Roles="Chef")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderServicio _orderServicio;

        public OrderController(IOrderServicio orderServicio)
        {
            _orderServicio = orderServicio;
        }
        [HttpGet("listaOrdenes")]
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
        //[HttpPost]
        //public async Task<IActionResult> CrearOrder([FromBody] OrderCreateVM request)
        //{
        //    var personIdClaim = User.Claims.FirstOrDefault(c => c.Type == "personId");
        //    if (personIdClaim == null)
        //    {
        //        return Unauthorized("No se pudo obtener el ID de la persona de la sesión.");
        //    }

        //    var personId = int.Parse(personIdClaim.Value);
        //    var response = await _orderServicio.CrearOrder(request,personId);
        //    return Ok(response);
        //}

        //[HttpPut("id")]
        //public async Task<IActionResult> UpdateOrder(int id, [FromBody] OrderUpdateVM request)
        //{
        //    var result = await _orderServicio.UpdateOrder(id, request);
        //    return Ok(result);
        //}

        [HttpDelete("id")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var result = await _orderServicio.DeleteOrder(id);
            return Ok(result);
        }
    }
}
