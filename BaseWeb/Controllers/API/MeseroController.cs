using BaseWeb.SignalR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Services.IServicio;
using static Domain.ViewModels.CommandVM;

namespace BaseWeb.Controllers.API
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(Roles = "Waiter")]
    public class MeseroController : ControllerBase
    {
        private readonly IMeseroServicio _meseroServicio;
        private readonly IHubContext<CommandHub> _hubContext;
        public MeseroController(IMeseroServicio meseroServicio, IHubContext<CommandHub> hubContext) 
        { 
            _hubContext = hubContext;
            _meseroServicio = meseroServicio;
        }

        [HttpGet("Comandas")]
        public async Task<IActionResult> Comandas()
        {
            var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
            var companyId = int.Parse(companyIdClaim.Value);
            var personIdClaim = User.Claims.FirstOrDefault(c => c.Type == "personId");
            var personId = int.Parse(personIdClaim.Value);
            var response = await _meseroServicio.ObtenerComandas(personId, companyId);
            return Ok(response);
        }
        [HttpPost("ComandasYOrdenes")]
        public async Task<IActionResult> CrearComandaYOrdenes(CommandCreateVM req)
        {
            var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
            var companyId = int.Parse(companyIdClaim.Value);
            var personIdClaim = User.Claims.FirstOrDefault(c => c.Type == "personId");
            var personId = int.Parse(personIdClaim.Value);
            var response = await _meseroServicio.CrearComandaYOrdenes(personId, companyId, req);
            if (response.IsSuccess) 
            {
                await _hubContext.Clients.Group(companyId.ToString()).SendAsync("OnCommandCreated", response.Result);
            }
            return Ok(response);

        }
        [HttpPut("PedirTicket/{id}")]
        public async Task<IActionResult> PedirTicket(int id)
        {
            var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
            var companyId = int.Parse(companyIdClaim.Value);
            var personIdClaim = User.Claims.FirstOrDefault(c => c.Type == "personId");
            var personId = int.Parse(personIdClaim.Value);
            var response = await _meseroServicio.PedirTicket(id, companyId);
            if (response.IsSuccess)
            {
                await _hubContext.Clients.Group(companyId.ToString()).SendAsync("OnCommandUpdated", response.Result);
            }
            return Ok(response);
        }
        [HttpPut("CobrarComanda/{id}")]
        public async Task<IActionResult> CobrarComanda(int id)
        {
            var companyIdClaim = User.Claims.FirstOrDefault(c => c.Type == "companyId");
            var companyId = int.Parse(companyIdClaim.Value);
            var personIdClaim = User.Claims.FirstOrDefault(c => c.Type == "personId");
            var personId = int.Parse(personIdClaim.Value);
            var response = await _meseroServicio.CobrarComanda(id, companyId);
            if (response.IsSuccess)
            {
                await _hubContext.Clients.Group(companyId.ToString()).SendAsync("OnCommandUpdated", response.Result);
            }
            return Ok(response);
        }
    }
}
