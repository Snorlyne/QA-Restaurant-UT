import apiClient from "../auth/AuthInterceptor";
import { IVentaPerYear } from "../interfaces/IVentaPerYear";

const ventasServices = {
    async getPearYear(): Promise<IVentaPerYear[]> {
        try {
            const response = await apiClient.get("/Ventas/PerYear");
            return response.data.result as IVentaPerYear[];
        } catch (error) {
            throw error;
        }
    },
}
export default ventasServices