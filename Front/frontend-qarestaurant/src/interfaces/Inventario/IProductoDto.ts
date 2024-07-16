export default interface IProductoDto {
    nombre: string;
    descripcion: string;
    precio: number;
    preparado: boolean;
    imagenInventario: string | null;
    categoria: number;
}