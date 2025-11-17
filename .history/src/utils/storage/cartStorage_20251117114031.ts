// utils/storage/cartStorage.ts
import type { CartItem } from "@/context/cart/CartContext";

const CART_KEY_PREFIX = "carrito_";

// Key única para cada usuario → carrito_123 | carrito_ana@mail.com
const getUserCartKey = (userId: string | null): string =>
  `${CART_KEY_PREFIX}${userId ?? "guest"}`;

// =============================
// GET
// =============================
export const getCart = (userId: string | null): CartItem[] => {
  try {
    const key = getUserCartKey(userId);
    const data = localStorage.getItem(key);
    return data ? (JSON.parse(data) as CartItem[]) : [];
  } catch {
    return [];
  }
};

// =============================
// SET
// =============================
export const setCart = (userId: string | null, items: CartItem[]) => {
  const key = getUserCartKey(userId);
  localStorage.setItem(key, JSON.stringify(items));
};

// =============================
// CLEAR
// =============================
export const clearCart = (userId: string | null) => {
  const key = getUserCartKey(userId);
  localStorage.removeItem(key);
};
