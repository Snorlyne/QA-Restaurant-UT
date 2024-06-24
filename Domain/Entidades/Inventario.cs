using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entidades
{
    public class Inventario
    {
        [Key]
        public int Id { get; set; }
        public byte[] ImagenInventario { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public decimal Precio { get; set; }
        public Boolean Preparado { get; set; }


        [ForeignKey("Categorias")]
        public int? FK_Categoria { get; set; }
        public Categorias Categorias { get; set; }
        public ICollection<Order> Orders { get; set; }

    }
}
