export type OrderStatus =
  | "pendiente"
  | "preparando"
  | "en_camino"
  | "entregado";

export interface OrderItem {
  codigo: string;
  nombre: string;
  cantidad: number;
  precio: number;
  mensaje?: string | null;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  fechaPedido: string;
  fechaEntrega: string;
  total: number;
  status: OrderStatus;
}
