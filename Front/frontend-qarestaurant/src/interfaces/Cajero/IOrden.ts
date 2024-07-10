import Producto from "./IProducto";

export default interface IOrden {
    id: number;
    estado: string;
    producto: Producto;
}