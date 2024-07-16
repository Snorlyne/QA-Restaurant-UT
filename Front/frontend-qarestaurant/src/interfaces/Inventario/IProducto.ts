export default interface IProducto {
    id: number;
    nombre: string;
    imagenInventario: string | null;
    categoria: string;
    descripcion: string;
    precio: number;
    preparado: boolean;
}