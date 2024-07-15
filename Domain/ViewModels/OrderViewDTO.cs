using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entidades;
using static Domain.ViewModels.InventarioVM;
using static Domain.ViewModels.StatusVM;

namespace Domain.DTOs
{
    public class OrderViewDTO
    {
        public int Id { get; set; }
        public int Mesa { get; set; }
        public string Adicional { get; set; }
        public StatusView Status { get; set; }
        public  ViewChef Inventario { get; set; }
    }

}

