export default interface ICliente {
    id: number;
    nombre: string;
    apellido_Paterno: string;
    apellido_Materno: string;
    curp: string;
    fechaNacimiento: Date | string;
    foto: string | null;
    company: {
        id: number;
        nombre: string;
    };
    user: {
        id: number;
        email: string;
    };
} 