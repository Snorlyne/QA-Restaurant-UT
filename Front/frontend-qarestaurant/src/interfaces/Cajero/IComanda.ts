import Orden from "./IOrden";

export default interface IComanda {
    id: number;
    meseroCargo: string;
    cobrador: string;
    total: number;
    mesa: number;
    estado: string;
    imagen: string;
    ordenes: Orden[];
}