using Domain.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Services.IServicio;
using Services.Servicio;

namespace BaseWeb.Controllers.API.Auth
{
    [Route("[controller]")]
    [ApiController]
    public class APIAuthController : ControllerBase
    {
        private readonly IAuthServicio _authServicio;
        public APIAuthController(IAuthServicio authServicio) 
        {
            _authServicio = authServicio;
        }
        [HttpPost("Login")]
        public async Task<IActionResult> Login(AuthVM.Request request)
        {
            var response = await _authServicio.Login(request);
            return Ok(response);
        }
    }
}
