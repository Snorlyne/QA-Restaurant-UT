import apiClient from "../AuthService/authInterceptor";
import IEmpleado from "../interfaces/Empleado/IEmpleado";
import IEmpleadoDto from "../interfaces/Empleado/IEmpleadoDto";
import IResponse from "../interfaces/IResponse.";

const empleadoServices = {
    async getEmpleados(): Promise<IEmpleado[]> {
        try {
            const response = await apiClient.get("/APIColaborador/lista");
            return response.data.result as IEmpleado[];
        }catch (err) {
            throw err;
        }
    },
    async getEmpleado(id:string): Promise<IEmpleadoDto> {
        try {
            const response = await apiClient.get(`/APIColaborador/${id}`);
            return response.data.result as IEmpleadoDto;
        }catch (err) {
            throw err;
        }
    },
    async post(req: IEmpleadoDto): Promise<IResponse> {
        try {
            const response = await apiClient.post("/APIColaborador", req);
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    },
    async put(id: string, req: IEmpleadoDto): Promise<IResponse> {
        try {
            const response = await apiClient.put(`/APIColaborador/${id}`, req);
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    },
    async delete(id: number): Promise<IResponse> {
        try {
            const response = await apiClient.delete(`/APIColaborador/${id}`);
            return response.data as IResponse;
        } catch (error) {
            throw error;
        }
    }
}

export default empleadoServices;