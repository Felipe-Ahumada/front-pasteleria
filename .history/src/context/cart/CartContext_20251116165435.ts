import { createContext } from "react";

export type CartItem = {
  codigo: string;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
  mensaje?: string | null;
};

export type CartTotals = {
  totalCantidad: number;
  subtotal: number;
  discountAmount: number;
  discountDescription: string | null;
  totalPrecio: number;
  totalPagar: number; // ← agrégalo aquí también
};

export type CartContextType = {
  items: CartItem[];
  totals: CartTotals;
  addItem: (item: CartItem) => void;
  removeItem: (codigo: string, mensaje?: string | null) => void;
  updateQuantity: (codigo: string | null, mensaje: string | null, cantidad: number) => void;
  clear: () => void;
};

export const CartContext = createContext<CartContextType | null>(null);
