using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entidades
{
    public class Company
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(maximumLength: 60)]
        public string Nombre { get; set; }
        public ICollection<Person> Persons { get; set; }
        public ICollection<Categorias> Categorias { get; set; }
    }
}
