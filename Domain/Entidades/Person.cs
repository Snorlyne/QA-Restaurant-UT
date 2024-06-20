using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entidades
{
    public class Person
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(maximumLength: 20)]
        public string Nombre { get; set; }
        [Required]
        [StringLength(maximumLength: 20)]
        public string Apellido_Paterno { get; set; }
        [StringLength(maximumLength: 20)]
        public string Apellido_Materno { get; set; }
        [Required]
        [StringLength(maximumLength: 60)]
        public string CURP { get; set; }
        [Required]
        public DateTime FechaNacimiento { get; set; }
        public byte[] Foto { get; set; }
        [ForeignKey("User")]
        public int FK_User_Id { get; set; }
        [ForeignKey("Company")]
        public int FK_Company_Id { get; set; }
        public Company Company { get; set; }
        public User User { get; set; }
        public ICollection<Order> Orders { get; set; }


    }
}
