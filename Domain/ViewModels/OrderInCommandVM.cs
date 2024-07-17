using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Domain.ViewModels.CommandVM;
using static Domain.ViewModels.OrderVM;

namespace Domain.ViewModels
{
    public class OrderInCommandVM
    {
        public class OrderInCommandViewVM
        {
            public int Id { get; set; }
            
            public CommandViewVM Command { get; set; }
            public OrderViewVM Order { get; set; }
        }

        public class CommandViewVM 
        {
            public int Id { get; set; }
        }

        //public class OrderViewVM
        //{
        //    public int Id { get; set; }
        //    public int Mesa { get; set; }
        //}
    }
}
