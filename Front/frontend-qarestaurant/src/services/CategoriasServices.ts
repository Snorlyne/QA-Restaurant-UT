import apiClient from "../AuthService/authInterceptor";
import ICategoria from "../interfaces/Categoria/ICategoria";
import ICategoriaDto from "../interfaces/Categoria/ICategoriaDto";
import IResponse from "../interfaces/IResponse.";

const categoriaServices = {
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
            const response = await apiClient.get(`/APICategoria/${id}`);
            return response.data.result as ICategoria;
        } catch (error) {
            throw error;
        }
    },
    async post(req: ICategoriaDto): Promise<IResponse> {
        try {
            const response = await apiClient.post("/APICategoria", req);
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    },
    async put(id: string, req: ICategoriaDto): Promise<IResponse> {
        try {
            const response = await apiClient.put(`/APICategoria/${id}`, req);
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    },
    async delete(id:number): Promise<IResponse> {
        try {
            const response = await apiClient.delete(`/APICategoria/${id}`);
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    }
}

export default categoriaServices;