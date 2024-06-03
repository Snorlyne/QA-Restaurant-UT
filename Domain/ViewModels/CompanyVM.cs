using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels
{
    public class CompanyVM
    {
        public class CompanyCreate
        {
            public string Nombre { get; set; }
        }
        public class CompanyView
        {
            public int Id { get; set; }
            public string Nombre { get; set; }
        }
    }
}
