using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ViewModels
{
    public class AuthVM
    {
        public class Request 
        { 
            public string Email { get; set; }
            public string Password { get; set; }
        }
        public class Response
        {
            public string Email { get; set; }
            public string Rol { get; set; }
            public string Nombre { get; set; }
            public int? Empresa { get; set; }
            public string JWTtoken { get; set; }
        }

    }
}
