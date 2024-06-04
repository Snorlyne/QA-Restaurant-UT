using Domain.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels
{
    public class UserVM
    {
        public class UserCreate
        {
            public string Email { get; set; }
            public string Password { get; set; }
            public int FK_Rol_Id { get; set; }
        }

        public class UserView
        {
            public string Email { get; set; }
            public string Password { get; set; }
            public int FK_Rol_Id { get; set; }
            public Role Role { get; set; }
        }
    }
}
