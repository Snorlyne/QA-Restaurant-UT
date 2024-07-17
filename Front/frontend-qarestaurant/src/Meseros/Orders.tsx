// Define la interfaz para ProductoMeseroVM
export interface ProductoMeseroVM {
    nombre: string;
}

// Define la interfaz para OrdenMeseroVM
export interface OrdenMeseroVM {
    id: number;
    estado: string;
    fecha: string;
    producto: ProductoMeseroVM;
}

// Define la interfaz para ViewComandasMeseroVM
export interface ViewComandasMeseroVM {
    id: number;
    mesa: number;
    estado: string;
    ordenes: OrdenMeseroVM[];
}

// Define la interfaz para la respuesta de la API
export interface ApiResponse {
    isSuccess: boolean;
    message: string | null;
    result: ViewComandasMeseroVM[];
}