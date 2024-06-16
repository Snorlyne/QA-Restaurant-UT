using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entidades
{
    public class Categorias
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string NombreCategoria { get; set; }

        [ForeignKey("Company")]
        public int FK_Company { get; set; }
        public Company Company { get; set; }
        public ICollection<Inventario> Inventarios { get; set; }

    }
}
