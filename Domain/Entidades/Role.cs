using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entidades
{
    public class Role
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(maximumLength:20)]
        public string Nombre { get; set; }
    }
}
