using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entidades
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(maximumLength: 60)]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }

        [ForeignKey("Role")]
        public int FK_Rol_Id { get; set; }
        public Role Role { get; set; }

    }
}
