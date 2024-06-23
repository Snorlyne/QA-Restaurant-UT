using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entidades
{
    public class OrdersInCommand
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("Command")]
        public int FK_command_id { get; set; }
        public Command Command { get; set; }
        [ForeignKey("Order")]
        public int FK_order_id { get; set; }
        public Order Order { get; set; }
    }
}
