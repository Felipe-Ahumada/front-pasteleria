export type OrderStatus =
  | "pendiente"
  | "preparando"
  | "en_camino"
  | "entregado"
  | "cancelado";

export type OrderItem = {
  codigo: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
  mensaje?: string | null;
};

export type OrderShipping = {
  run: string;
  nombres: string;
  apellidos: string;
  correo: string;
  regionId: string;
  regionNombre?: string;
  comuna: string;
  direccion: string;
  tipoEntrega: string;
  metodoPago: string;
};

export type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  fechaPedido: string;
  fechaEntrega: string;
  total: number;
  status: OrderStatus;
  envio: OrderShipping; // ← AHORA SÍ EXISTE
};
