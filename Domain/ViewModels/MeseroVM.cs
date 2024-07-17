using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels
{
    public class MeseroVM
    {
        public class ViewComandasMeseroVM
        {
            public int Id { get; set; }
            public int Mesa { get; set; }
            public string Estado { get; set; }
            public OrdenMeseroVM[] Ordenes { get; set; }
        }
        public class OrdenMeseroVM
        {
            public int Id { get; set; }
            public string Estado { get; set; }
            public ProductoMeseroVM Producto { get; set; }
        }
        public class ProductoMeseroVM
        {
            public string Nombre { get; set; }
        }
    }
}
