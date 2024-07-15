import apiClient from "../auth/AuthInterceptor";
import IProducto from "../interfaces/Inventario/IProducto";
import IProductoDto from "../interfaces/Inventario/IProductoDto";
import IResponse from "../interfaces/IResponse.";

const inventarioServices = {
    async getProductos(): Promise<IProducto[]> {
        try {
            const response = await apiClient.get("/Inventario");
            return response.data.result as IProducto[];
        }catch (err) {
            throw err;
        }
    },
    async getProducto(id:string): Promise<IProductoDto> {
        try {
            const response = await apiClient.get(`/Inventario/${id}`);
            return response.data.result as IProductoDto;
        }catch (err) {
            throw err;
        }
    },
    async post(req: IProductoDto): Promise<IResponse> {
        try {
            const response = await apiClient.post("/Inventario", req);
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    },
    async put(id: string, req: IProductoDto): Promise<IResponse> {
        try {
            const response = await apiClient.put(`/Inventario/${id}`, req);
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    },
    async delete(id: number): Promise<IResponse> {
        try {
            const response = await apiClient.delete(`/Inventario/${id}`);
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    }
}

export default inventarioServices;