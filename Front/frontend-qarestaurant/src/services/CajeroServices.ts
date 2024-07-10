import apiClient from "../AuthService/authInterceptor";
import IComanda from "../interfaces/Cajero/IComanda";
import IResponse from "../interfaces/IResponse.";

const cajeroServices = {
    async getComandas(): Promise<IComanda[]> {
        try {
            const response = await apiClient.get("/APICajero/Comandas");
            return response.data.result as IComanda[];
        } catch (error) {
            throw error;
        }
    },
    async facturar(id: number): Promise<IResponse> {
        try {
            const response = await apiClient.post(`/APICajero/Ticket/${id}`);
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    },
    async deleteOrder(id: number): Promise<IResponse> {
        try {
            const response = await apiClient.delete(
                `/APICajero/Orden/${id}`
            );
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    },
    async deleteCommand(id: number): Promise<IResponse> {
        try {
            const response = await apiClient.delete(
                `/APICajero/Comanda/${id}`
            );
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    },
}
export default cajeroServices