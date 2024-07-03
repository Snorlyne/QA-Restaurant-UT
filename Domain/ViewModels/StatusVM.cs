using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels
{
    public class StatusVM
    {
        public class StatusCreate
        {
            public string Nombre { get; set; }
        }

        public class StatusView
        {
            public int Id { get; set; }
            public string Nombre { get; set; }
        }
    }
}
