using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entidades
{
    public class Command
    {
        [Key]
        public int Id { get; set; }
        public int Propietario { get; set; }
        //Relacion indirecta con Person
        public int? Cobrador { get; set; }
        public decimal Total { get; set; }
        public DateTime Fecha { get; set; }
        public ICollection<OrdersInCommand> OrdersInCommands { get; set; }
        //Relacion indirecta con Company
        public int Restaurante { get; set; }
    }
}
