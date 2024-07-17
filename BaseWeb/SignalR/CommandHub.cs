using Domain.Entidades;
using Microsoft.AspNetCore.SignalR;

namespace BaseWeb.SignalR
{
    public class CommandHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var idEmpresa = Context.GetHttpContext().Request.Query["idEmpresa"];

            // Agregar la conexión al grupo de la empresa basada en idEmpresa
            await Groups.AddToGroupAsync(Context.ConnectionId, idEmpresa);

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var idEmpresa = Context.GetHttpContext().Request.Query["idEmpresa"];

            // Eliminar la conexión del grupo de la empresa basada en idEmpresa
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, idEmpresa);

            await base.OnDisconnectedAsync(exception);
        }

        public async Task OnCommandCreated(string companyId, object res)
        {
            // Enviar a todas las conexiones del grupo correspondiente
            await Clients.Group(companyId).SendAsync("OnCommandCreated", res);
        }

        public async Task OnCommandUpdated(string companyId, object res)
        {
            // Enviar a todas las conexiones del grupo correspondiente
            await Clients.Group(companyId).SendAsync("OnCommandUpdated", res);
        }

        public async Task OnCommandDeleted(string companyId, int commandId)
        {
            // Enviar a todas las conexiones del grupo correspondiente
            await Clients.Group(companyId).SendAsync("OnCommandDeleted", commandId);
        }
        public async Task OnOrderDeleted(string companyId, object res)
        {
            // Enviar a todas las conexiones del grupo correspondiente
            await Clients.Group(companyId).SendAsync("OnOrderDeleted", res);
        }
        public async Task OnOrderUpdated(string companyId, object res)
        {
            // Enviar a todas las conexiones del grupo correspondiente
            await Clients.Group(companyId).SendAsync("OnOrderUpdated", res);
        }
    }
}
