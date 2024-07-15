using Domain.DTOs;
using Domain.Util;
using Domain.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Domain.ViewModels.OrderInCommandVM;

namespace Services.IServicio
{
    public interface ICocinerosServicio
    {
        Task<Response<List<OrderViewDTO>>> ObtenerOrdenes(int companyId);
        Task<Response<bool>> ActualizarEstadoOrden(int ordenId, string nuevoEstado);
}
}

