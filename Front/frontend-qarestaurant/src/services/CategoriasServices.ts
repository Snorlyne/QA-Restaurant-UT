// src/services/CategoriaService.ts

import apiClient from "../AuthService/authInterceptor";
import ICategoria from "../interfaces/ICategoria";
import IResponse from "../interfaces/IResponse.";

const CategoriaService = {
    async getCategorias(): Promise<ICategoria[]> {
        try {
            const response = await apiClient.get('/APICategoria');
            return response.data.result as ICategoria[];
        } catch (error) {
            throw error;
        }
    },

    async getCategoria(id: string): Promise<ICategoria> {
        try {
            const response = await apiClient.get(`/APICategoria/Id?Id=${id}`);
            return response.data.result as ICategoria;
        } catch (error) {
            throw error;
        }
    },
    async post(req: ICategoria): Promise<IResponse> {
        try {
            const response = await apiClient.post("/APICategoria", req);
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    },
    async put(id: string, req: ICategoria): Promise<IResponse> {
        try {
            const response = await apiClient.put(`/APICategoria/Id?Id=${id}`, req);
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    },
    async delete(id:number): Promise<IResponse> {
        try {
            const response = await apiClient.delete(`/APICategoria/Id?Id=${id}`);
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    }
}

export default CategoriaService;