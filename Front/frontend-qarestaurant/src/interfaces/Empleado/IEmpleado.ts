export default interface IEmpleado {
    id: number;
    nombre: string;
    apellido_Paterno: string;
    apellido_Materno: string;
    curp: string;
    fechaNacimiento: Date | string;
    foto: string | null;
    email: string;
    puesto: string;
}
