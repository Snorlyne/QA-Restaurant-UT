using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Domain.ViewModels.InventarioVM;

namespace Domain.ViewModels
{
    public class CajeroVM
    {
        public class ViewComandasCajaVM
        {
            public int Id {  get; set; }
            public string MeseroCargo {get;set;}
            public string Cobrador { get;set;}
            public decimal Total { get;set;}
            public int Mesa { get;set;}
            public string Estado { get; set; }
            public string Imagen { get; set; }
            public OrdenCajaVM[] Ordenes { get;set;}
        }
    }
    public class OrdenCajaVM
    {
        public int Id { get; set; }
        public string Estado { get; set; }
        public ProductoCajaVM Producto { get; set; }
    }
    public class ProductoCajaVM
    {
        public string Nombre { get; set;}
        public decimal Precio { get; set; }

    }
}
