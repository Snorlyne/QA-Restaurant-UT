import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr";
import authService from "./AuthServices";

export default function commandHub() {
    const idEmpresa = authService.getCompany();
    return new HubConnectionBuilder()
        .withUrl(`${process.env.REACT_APP_SIGNALR_HUB_URL}?idEmpresa=${idEmpresa}`, {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect()
        .build();
}