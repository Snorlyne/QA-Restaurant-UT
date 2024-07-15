import apiClient from "../auth/AuthInterceptor";
import IEmpresa from "../interfaces/Empresa/IEmpresa";
import IEmpresaDto from "../interfaces/Empresa/IEmpresaDto";
import IResponse from "../interfaces/IResponse.";

const empresaServices = {
    async getEmpresas(): Promise<IEmpresa[]> {
        try {
            const response = await apiClient.get("/Company/lista");
            return response.data.result as IEmpresa[];
        }catch (err) {
            throw err;
        }
    },
    async getEmpresa(id:string): Promise<IEmpresaDto> {
        try {
            const response = await apiClient.get(`/Company/${id}`);
            return response.data.result as IEmpresaDto;
        }catch (err) {
            throw err;
        }
    },
    async post(req: IEmpresaDto): Promise<IResponse> {
        try {
            const response = await apiClient.post("/Company", req);
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    },
    async put(id: string, req: IEmpresaDto): Promise<IResponse> {
        try {
            const response = await apiClient.put(`/Company/${id}`, req);
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    },
    async delete(id: number): Promise<IResponse> {
        try {
            const response = await apiClient.delete(`/Company/${id}`);
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    }
}

export default empresaServices;