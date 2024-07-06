export default interface IClienteDto {
    nombre: string;
    apellido_Paterno: string;
    apellido_Materno: string;
    curp: string;
    fechaNacimiento: Date | string;
    foto: string | null;
    fk_company_id: number | null;
}