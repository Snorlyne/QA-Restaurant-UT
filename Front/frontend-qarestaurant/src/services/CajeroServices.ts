import apiClient from "../auth/AuthInterceptor";
import IComanda from "../interfaces/Cajero/IComanda";
import IResponse from "../interfaces/IResponse.";

const cajeroServices = {
    async getComandas(): Promise<IComanda[]> {
        try {
            const response = await apiClient.get("/Cajero/Comandas");
            return response.data.result as IComanda[];
        } catch (error) {
            throw error;
        }
    },
    async facturar(id: number): Promise<IResponse> {
        try {
            const response = await apiClient.post(`/Cajero/Ticket/${id}`);
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    },
    async deleteOrder(id: number): Promise<IResponse> {
        try {
            const response = await apiClient.delete(
                `/Cajero/Orden/${id}`
            );
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    },
    async deleteCommand(id: number): Promise<IResponse> {
        try {
            const response = await apiClient.delete(
                `/Cajero/Comanda/${id}`
            );
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    },
}
export default cajeroServices