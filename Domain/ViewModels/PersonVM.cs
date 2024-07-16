using Domain.Entidades;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Domain.ViewModels.CompanyVM;
using static Domain.ViewModels.RoleVM;
using static Domain.ViewModels.UserVM;

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
            public string Foto { get; set; }
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
            public string Foto { get; set; }
            public CompanyView Company { get; set; }
            public UserView User { get; set; }
        }
        public class ColaboradorCreate
        {
            public string Nombre { get; set; }
            public string Apellido_Paterno { get; set; }
            public string Apellido_Materno { get; set; }
            public string CURP { get; set; }
            public DateTime FechaNacimiento { get; set; }
            public string Foto { get; set; }
            public int Role { get; set; }
        }
        public class ColaboradorView
        {
            public int Id { get; set; }
            public string Nombre { get; set; }
            public string Apellido_Paterno { get; set; }
            public string Apellido_Materno { get; set; }
            public string CURP { get; set; }
            public DateTime FechaNacimiento { get; set; }
            public string Foto { get; set; }
            public string Email { get; set; }
            public string Puesto { get; set; }
        }
    }
}
