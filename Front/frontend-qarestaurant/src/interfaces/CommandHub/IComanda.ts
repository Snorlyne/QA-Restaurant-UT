export default interface ICommanda {
    id: number;
    propietario: string;
    cobrador?: string;
    total: number;
    fecha: Date;
    restaurante: number;
    tipo: string;
    ordenes: Orden[];
}
interface Orden {
    id: number;
    mesa: number;
    fecha: Date;
    adicional: string;
    status: IStatus;
    producto: IProducto;
}

interface IStatus {
    id: number;
    nombre: string;
}

interface IProducto {
    id: number;
    imagenInventario: string;
    nombre: string;
    categoria: string;
    descripcion: string;
    precio: number;
    preparado: boolean;
}