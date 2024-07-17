using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Domain.ViewModels.InventarioVM;
using static Domain.ViewModels.PersonVM;
using static Domain.ViewModels.StatusVM;

namespace Domain.ViewModels
{
    public class OrderVM
    {
        public class OrderCreateVM 
        {
            public string Adicional { get; set; }
            public int? FK_inventory_id { get; set; }
        }
        public class OrderViewVM
        {
            public int Id { get; set; }
            public int Mesa { get; set; }
            public DateTime Fecha { get; set; }
            public string Adicional { get; set; }
            public StatusView Status { get; set; }
            public ViewProductoVM Producto { get; set; }
        }


        //public class OrderUpdateVM
        //{
        //    public int Mesa { get; set; }
        //    public DateTime Fecha { get; set; }
        //    public string Adicional { get; set; }
        //    public int? FK_person_id { get; set; }
        //    public int FK_status_id { get; set; }
        //    public int? FK_inventory_id { get; set; }
        //}

        //public class StatusView
        //{
        //    public int Id { get; set; }
        //    public string Nombre { get; set; }
        //}

        //public class ClienteView
        //{
        //    public int Id { get; set; }
        //    public string Nombre { get; set; }
        //}

        //public class ViewProductoVM
        //{
        //    public int Id { get; set; }
        //    public string Nombre { get; set; }
        //}
    }
}
