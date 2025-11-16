export type OrderStatus =
  | "pendiente"
  | "preparando"
  | "en_camino"
  | "entregado";

export interface Order {
  id: string;
  userId: string;
  items: {
    codigo: string;
    nombre: string;
    cantidad: number;
    precio: number;
    mensaje?: string | null;
  }[];

  fechaPedido: string;
  fechaEntrega: string;
  total: number;

  status: OrderStatus;
}
