import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr";
import authService from "./authservice";

export default async function commandHub() {
    const idEmpresa = await authService.getCompany();
    return new HubConnectionBuilder()
        .withUrl(`https://localhost:7047/commandHub?idEmpresa=${idEmpresa}`, {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect()
        .build();
}