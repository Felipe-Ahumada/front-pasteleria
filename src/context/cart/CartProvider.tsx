// context/cart/CartProvider.tsx
import { useState, useCallback, useMemo } from "react";
import { CartContext, type CartItem } from "./CartContext";
import { getCart, setCart, clearCart as clearStorage } from "@/utils/storage/cartStorage";

interface Props {
  children: React.ReactNode;
}

export const CartProvider = ({ children }: Props) => {
  const [items, setItems] = useState<CartItem[]>(() => getCart());

  const sync = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
    setCart(newItems);
  }, []);

  /** ----------------------
   * ADD ITEM (con variantes)
   * ---------------------- */
  const addItem = useCallback(
    (item: CartItem) => {
      const normalizedMsg = (item.mensaje ?? "").trim().toLowerCase();

      const updated = [...items];
      const existingIndex = updated.findIndex(
        (i) =>
          i.codigo === item.codigo &&
          (i.mensaje ?? "").trim().toLowerCase() === normalizedMsg
      );

      if (existingIndex >= 0) {
        updated[existingIndex] = {
          ...updated[existingIndex],
          cantidad: updated[existingIndex].cantidad + item.cantidad,
        };
      } else {
        updated.push(item);
      }

      sync(updated);
    },
    [items, sync]
  );

  /** ----------------------
   * REMOVE ITEM (por variante)
   * ---------------------- */
  const removeItem = useCallback(
    (codigo: string, mensaje?: string | null) => {
      const normalizedMsg = (mensaje ?? "").trim().toLowerCase();

      const updated = items.filter((i) => {
        const msg = (i.mensaje ?? "").trim().toLowerCase();
        return !(i.codigo === codigo && msg === normalizedMsg);
      });

      sync(updated);
    },
    [items, sync]
  );

  /** ----------------------
   * UPDATE QUANTITY (por variante)
   * ---------------------- */
  const updateQuantity = useCallback(
    (codigo: string, mensaje: string | null, cantidad: number) => {
      const normalizedMsg = (mensaje ?? "").trim().toLowerCase();

      const updated = items.map((i) => {
        const msg = (i.mensaje ?? "").trim().toLowerCase();
        if (i.codigo === codigo && msg === normalizedMsg) {
          return { ...i, cantidad };
        }
        return i;
      });

      sync(updated);
    },
    [items, sync]
  );

  /** ----------------------
   * CLEAR CART
   * ---------------------- */
  const clear = useCallback(() => {
    sync([]);
    clearStorage();
  }, [sync]);

  /** ----------------------
   * TOTALS
   * ---------------------- */
  const totals = useMemo(
    () => ({
      totalCantidad: items.reduce((acc, i) => acc + i.cantidad, 0),
      totalPrecio: items.reduce((acc, i) => acc + i.precio * i.cantidad, 0),
    }),
    [items]
  );

  return (
    <CartContext.Provider value={{ items, totals, addItem, removeItem, updateQuantity, clear }}>
      {children}
    </CartContext.Provider>
  );
};
