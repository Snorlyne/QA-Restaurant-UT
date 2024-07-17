using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Domain.ViewModels.OrderInCommandVM;
using static Domain.ViewModels.OrderVM;
using static Domain.ViewModels.PersonVM;

namespace Domain.ViewModels
{
    public class CommandVM
    {
        public class CommandCreateVM
        {
            public int Mesa { get; set; }
            public OrderCreateVM[] Ordenes { get; set; }
        }
        public class CommandViewVM
        {
            public int Id { get; set; }
            public string Propietario { get; set; }
            public string? Cobrador { get; set; }
            public decimal Total { get; set; }
            public DateTime Fecha { get; set; }
            public int Restaurante { get; set; }
            public string Tipo { get; set; }
            public OrderViewVM[] Ordenes { get; set; }
        }
        public class CommandUpdateStatusVM
        {
            public int Id { get; set; }
            public int Mesa { get; set; }
            public int Status { get; set; }
        }
        public class CommandOrderUpdateStatusVM
        {
            public int Id { get; set; }
            public int Mesa { get; set; }
            public int Status { get; set; }
        }
        public class CommandOrderDeleteVM
        {
            public int Id { get; set; }
            public int OrderId { get; set; }
        }
        public class CommandDeleteVM
        {
            public int Id { get; set; }
        }
    }
}
