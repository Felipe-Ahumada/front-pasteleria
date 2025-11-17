import type { CartItem } from "@/context/cart/CartContext";

const CART_KEY = "carrito";

export const getCart = (): CartItem[] => {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? (JSON.parse(data) as CartItem[]) : [];
  } catch {
    return [];
  }
};

export const setCart = (items: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
};
