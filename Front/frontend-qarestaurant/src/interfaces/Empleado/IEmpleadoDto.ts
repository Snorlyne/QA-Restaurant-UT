export default interface IEmpleadoDto {
    nombre: string;
    apellido_Paterno: string;
    apellido_Materno: string;
    curp: string;
    fechaNacimiento: Date | string;
    foto: string | null;
    role: number | null;
}