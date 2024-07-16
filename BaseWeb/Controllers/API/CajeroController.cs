using BaseWeb.SignalR;
using Domain.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Services.IServicio;
using Services.Servicio;
using System.ComponentModel.Design;
using static Domain.ViewModels.PersonVM;

namespace BaseWeb.Controllers.API
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(Roles = "Cashier")]
    public class CajeroController : ControllerBase
    {
        private readonly ICajeroServicio _cajeroServicio;
        private readonly IHubContext<CommandHub> _hubContext;
        public CajeroController(ICajeroServicio cajeroServicio, IHubContext<CommandHub> hubContext)
        {
            _cajeroServicio = cajeroServicio;
            _hubContext = hubContext;
        }
        [HttpGet("Comandas")]
        public async Task<IActionResult> Comandas()
        {
            var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
            var companyId = int.Parse(companyIdClaim.Value);
            var response = await _cajeroServicio.ObtenerComandas(companyId);
            return Ok(response);
        }
        [HttpPost("Ticket/{id}")]
        public async Task<IActionResult> TicektDeCobro(int id)
        {
            var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
            var companyId = int.Parse(companyIdClaim.Value);
            var personIdClaim = User.Claims.FirstOrDefault(c => c.Type == "personId");
            var personId = int.Parse(personIdClaim.Value);
            var response = await _cajeroServicio.GenerarTicketDeCobro(id, personId, companyId);
            if (response.IsSuccess)
            {
                await _hubContext.Clients.Group(companyId.ToString()).SendAsync("OnCommandUpdated", response.Result);
            }
            return Ok(response);
        }
        [HttpDelete("Comanda/{id}")]
        public async Task<IActionResult> EliminarComanda(int id)
        {
            var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
            var companyId = int.Parse(companyIdClaim.Value);
            var response = await _cajeroServicio.EliminarComanda(id, companyId);
            if (response.IsSuccess)
            {
                await _hubContext.Clients.Group(companyId.ToString()).SendAsync("OnCommandDeleted", id);
            }
            return Ok(response);
        }

        [HttpDelete("Orden/{id}")]
        public async Task<IActionResult> EliminarOrden(int id)
        {
            var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
            var companyId = int.Parse(companyIdClaim.Value);
            var response = await _cajeroServicio.EliminarOrden(id, companyId);
            if (response.IsSuccess)
            {
                await _hubContext.Clients.Group(companyId.ToString()).SendAsync("OnOrderDeleted", response.Result);
            }
            return Ok(response);
        }
    }
}
