using Domain.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels
{
    public class InventarioVM
    {

        public class CreateProductoVM
        {
            public string ImagenInventario { get; set; }
            public string Nombre { get; set; }
            public int Categoria { get; set; }
            public string Descripcion { get; set; }
            public decimal Precio { get; set; }
            public Boolean Preparado { get; set; }

        }
        public class ViewProductoVM
        {
            public int Id { get; set; }
            public string ImagenInventario { get; set; }
            public string Nombre { get; set; }
            public string Categoria { get; set; }
            public string Descripcion { get; set; }
            public decimal Precio { get; set; }
            public Boolean Preparado { get; set; }

        }
        
        public class  ViewChef
        {
            public int Id { get; set; }
            public string ImagenInventario { get; set; }
            public string Nombre { get; set; }

        }
    }
}
