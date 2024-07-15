using Domain.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.IServicio;
using Services.Servicio;

namespace BaseWeb.Controllers.API.Auth
{
    [Route("[controller]")]
    [ApiController]
  

    public class AuthController : ControllerBase
    {
        private readonly IAuthServicio _authServicio;
        public AuthController(IAuthServicio authServicio) 
        {
            _authServicio = authServicio;
        }
        [HttpPost("Login")]
        public async Task<IActionResult> Login(AuthVM.Request request)
        {
            var response = await _authServicio.Login(request);
            return Ok(response);
        }

        [HttpPut("change-password")]
        [Authorize]

        public async Task<IActionResult> ChangePassword([FromBody] UserVM.UserChangePassword request)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "userId");
            var userId = int.Parse(userIdClaim.Value);
            var response = await _authServicio.CambiarContrasena(userId, request);
            if (!response.IsSuccess)
            {
                return BadRequest(response.Message);
            }
            return Ok(response.Message);
        }
    }
}
