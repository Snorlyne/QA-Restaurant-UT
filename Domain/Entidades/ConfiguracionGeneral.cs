using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entidades
{
    public class ConfiguracionGeneral
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string PasswordGeneral { get; set; }
        [ForeignKey("Company")]
        public int FK_Company_Id { get; set; }
        public Company Company { get; set; }
    }
}
