using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Util
{
    public class Response<T>
    {
        public Response() { }

        public Response(T data, string message = null)
        {
            IsSuccess = true;
            Message = message;
            Result = data;
        }
        public Response(string message)
        {
            IsSuccess = false;
            Message = message;
        }
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public T Result { get; set; }
    }
}
