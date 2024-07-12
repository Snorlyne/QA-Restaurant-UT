using Domain.Entidades;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Domain.ViewModels.RoleVM;

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
            public RoleView Role { get; set; }
        }
        public class UserChangePassword
        {
            public string OldPassword { get; set; }
            public string NewPassword { get; set; }
        }
    }
}
