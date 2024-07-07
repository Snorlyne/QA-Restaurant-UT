﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.IServicio;

namespace BaseWeb.Controllers.API
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(Roles = "Root")]
    public class APIStatusController : ControllerBase
    {
        private readonly IStatusServicio _statusServicio;

        public APIStatusController(IStatusServicio statusServicio)
        {
            _statusServicio = statusServicio;
        }

        [HttpGet("lista")]
        public async Task<IActionResult> ObtenerLista() 
        {
            var response = await _statusServicio.ObtenerLista();
            return Ok(response);
        }
    }
}
