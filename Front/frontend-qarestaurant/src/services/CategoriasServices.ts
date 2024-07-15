import apiClient from "../auth/AuthInterceptor";
import ICategoria from "../interfaces/Categoria/ICategoria";
import ICategoriaDto from "../interfaces/Categoria/ICategoriaDto";
import IResponse from "../interfaces/IResponse.";

const categoriaServices = {
    async getCategorias(): Promise<ICategoria[]> {
        try {
            const response = await apiClient.get('/Categoria');
            return response.data.result as ICategoria[];
        } catch (error) {
            throw error;
        }
    },

    async getCategoria(id: string): Promise<ICategoria> {
        try {
            const response = await apiClient.get(`/Categoria/${id}`);
            return response.data.result as ICategoria;
        } catch (error) {
            throw error;
        }
    },
    async post(req: ICategoriaDto): Promise<IResponse> {
        try {
            const response = await apiClient.post("/Categoria", req);
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    },
    async put(id: string, req: ICategoriaDto): Promise<IResponse> {
        try {
            const response = await apiClient.put(`/Categoria/${id}`, req);
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    },
    async delete(id:number): Promise<IResponse> {
        try {
            const response = await apiClient.delete(`/Categoria/${id}`);
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    }
}

export default categoriaServices;