using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Domain.ViewModels.OrderInCommandVM;

namespace Domain.ViewModels
{
    public class CommandVM
    {
        public class CommandViewVM
        {
            public int Id { get; set; }
            public int Propietario { get; set; }
            public int? Cobrador { get; set; }
            public decimal Total { get; set; }
            public DateTime Fecha { get; set; }
            public int Restaurante { get; set; }
        }

        public class CommandCreateVM
        {
            public int Propietario { get; set; }
            public int? Cobrador { get; set; }
            public decimal Total { get; set; }
            public DateTime Fecha { get; set; }
            public int Restaurante { get; set; }
        }
    }
}
