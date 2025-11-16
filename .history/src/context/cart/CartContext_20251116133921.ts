// context/cart/CartContext.ts
import { createContext } from "react";

export type CartItem = {
  codigo: string;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
  mensaje?: string | null;
};

export type CartContextType = {
  items: CartItem[];
  totals: {
    totalCantidad: number;
    totalPrecio: number;
  };
  addItem: (item: CartItem) => void;
  removeItem: (codigo: string, mensaje?: string | null) => void;
  updateQuantity: (codigo: string, mensaje: string | null, cantidad: number) => void;
  clear: () => void;
};

export const CartContext = createContext<CartContextType | null>(null);
