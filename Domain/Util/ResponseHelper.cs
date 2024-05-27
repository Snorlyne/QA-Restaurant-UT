using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Util
{
    public class ResponseHelper
    {
        public string Message { get; set; }
        public bool Success { get; set; }   
        public object HelperData { get; set; }
    }
}
