export interface Status {
    id: number;
    nombre: string;
}

export interface Person {
    id: number;
    nombre: string;
}

export interface Inventario {
    id: number;
    nombre: string;
}

export interface Order {
    id: number;
    mesa: number;
    fecha: string;
    adicional: string;
    status: Status;
    person: Person;
    inventario: Inventario;
}

export interface ApiResponse {
    isSuccess: boolean;
    message: string | null;
    result: Order[];
}