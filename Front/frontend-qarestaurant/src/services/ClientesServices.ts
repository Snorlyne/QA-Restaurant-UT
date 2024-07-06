import apiClient from "../AuthService/authInterceptor";
import ICliente from "../interfaces/Cliente/ICliente";
import IClienteDto from "../interfaces/Cliente/IClienteDto";
import IResponse from "../interfaces/IResponse.";

const ClienteServices = {
    async getClientes(): Promise<ICliente[]> {
        try {
            const response = await apiClient.get("/APICliente/lista");
            return response.data.result as ICliente[];
        }catch (err) {
            throw err;
        }
    },
    async getCliente(id:string): Promise<ICliente> {
        try {
            const response = await apiClient.get(`/APICliente/Id?Id=${id}`);
            return response.data.result as ICliente;
        }catch (err) {
            throw err;
        }
    },
    async post(req: IClienteDto): Promise<IResponse> {
        try {
            const response = await apiClient.post("/APICliente", req);
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    },
    async put(id: string, req: IClienteDto): Promise<IResponse> {
        try {
            const response = await apiClient.put(`/APICliente/Id?Id=${id}`, req);
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    },
    async delete(id:number): Promise<IResponse> {
        try {
            const response = await apiClient.delete(`/APICliente/Id?Id=${id}`);
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    }
}

export default ClienteServices;