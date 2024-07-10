export default interface IClienteDto {
    nombre: string;
    apellido_Paterno: string;
    apellido_Materno: string;
    curp: string;
    fechaNacimiento: Date | string;
    foto: string | null;
    fK_Company_Id: number | null;
}