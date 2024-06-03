using Domain.Entidades;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels
{
    public class PersonVM
    {
        public class ClienteCreate
        {
            public string Nombre { get; set; }
            public string Apellido_Paterno { get; set; }
            public string Apellido_Materno { get; set; }
            public string CURP { get; set; }
            public DateTime FechaNacimiento { get; set; }
            public int FK_Company_Id { get; set; }
        }
        public class ClienteView
        {
            public int Id { get; set; }
            public string Nombre { get; set; }
            public string Apellido_Paterno { get; set; }
            public string Apellido_Materno { get; set; }
            public string CURP { get; set; }
            public DateTime FechaNacimiento { get; set; }
            public Company Company { get; set; }
            public User User { get; set; }
        }
        public class PersonView
        {
            public int Id { get; set; }
            public string Nombre { get; set; }
            public string Apellido_Paterno { get; set; }
            public string Apellido_Materno { get; set; }
            public string CURP { get; set; }
            public DateTime FechaNacimiento { get; set; }
            public Company Company { get; set; }
            public User User { get; set; }
        }
    }
}
