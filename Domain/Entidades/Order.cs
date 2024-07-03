using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entidades
{
    public class Order
    {
        [Key]
        public int Id { get; set; }
        public int Mesa { get; set; }
        public DateTime Fecha { get; set; }
        public string Adicional { get; set; }
        [ForeignKey("Person")]
        public int? FK_person_id { get; set; }
        public Person Person { get; set; }

        [ForeignKey("Status")]
        public int FK_status_id { get; set; }
        public Status Status { get; set; }

        [ForeignKey("Inventario")]
        public int? FK_inventory_id { get; set; }
        public Inventario Inventario { get; set; }
        public ICollection<OrdersInCommand> OrdersInCommands { get; set; }
    }
}
