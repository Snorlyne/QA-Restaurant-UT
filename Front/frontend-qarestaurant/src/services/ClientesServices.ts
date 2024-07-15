import apiClient from "../auth/AuthInterceptor";
import ICliente from "../interfaces/Cliente/ICliente";
import IClienteDto from "../interfaces/Cliente/IClienteDto";
import IResponse from "../interfaces/IResponse.";

const clienteServices = {
    async getClientes(): Promise<ICliente[]> {
        try {
            const response = await apiClient.get("/Cliente/lista");
            return response.data.result as ICliente[];
        }catch (err) {
            throw err;
        }
    },
    async getCliente(id:string): Promise<IClienteDto> {
        try {
            const response = await apiClient.get(`/Cliente/${id}`);
            return response.data.result as IClienteDto;
        }catch (err) {
            throw err;
        }
    },
    async post(req: IClienteDto): Promise<IResponse> {
        try {
            const response = await apiClient.post("/Cliente", req);
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    },
    async put(id: string, req: IClienteDto): Promise<IResponse> {
        try {
            const response = await apiClient.put(`/Cliente/${id}`, req);
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    },
    async delete(id:number): Promise<IResponse> {
        try {
            const response = await apiClient.delete(`/Cliente/${id}`);
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    }
}

export default clienteServices;