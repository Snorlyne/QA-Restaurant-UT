using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels
{
    public class RoleVM
    {
        public class Create
        {
            public string Nombre { get; set; }
        }
        public class View
        {
            public int Id { get; set; }
            public string Nombre { get; set; }
        }
    }
}
