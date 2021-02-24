
import { DetallePedidoModel } from './detallePedido.model';
export class PedidoModel {
    id: string;
    secuencial: number;
    total: number;
    detallePedidos: DetallePedidoModel[];
    fechaDeCreacion: string;
    observaciones: string;
}