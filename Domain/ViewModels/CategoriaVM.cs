using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels
{
    public class CategoriaVM
    {
    }

    public class ViewCategoriaVM
    {
        public int id { get; set; }
        public string NombreCategoria { get; set; }

    }

    public class CreateCategiaVM 
    {
        public string NombreCategoria { get; set; }

    }

}
