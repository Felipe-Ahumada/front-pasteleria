// context/cart/CartProvider.tsx
import { useState, useCallback, useMemo } from "react";
import { CartContext, type CartItem } from "./CartContext";

import {
  getCart,
  setCart,
  clearCart as clearStorage,
} from "@/utils/storage/cartStorage";

import { menuService } from "@/service/menuService";
import useAuth from "@/hooks/useAuth";
import { getLocalItem } from "@/utils/storage/localStorageUtils";
import { LOCAL_STORAGE_KEYS } from "@/utils/storage/initLocalData";
import { calculateUserDiscounts } from "@/utils/discounts/userDiscounts";
import type { StoredUser } from "@/types/user";

interface Props {
  children: React.ReactNode;
}

export const CartProvider = ({ children }: Props) => {
  const [items, setItems] = useState<CartItem[]>(() => getCart());
  const { user: authUser } = useAuth();

  /** Usuario completo desde localStorage (StoredUser) */
  const storedUser: StoredUser | null = authUser
  ? (getLocalItem<StoredUser>(LOCAL_STORAGE_KEYS.activeUser) ?? null)
  : null;

  /* -------------------------------
      SYNC ESTADO + LOCAL STORAGE
  -------------------------------- */
  const sync = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
    setCart(newItems);
  }, []);

  /* -------------------------------
      OBTENER STOCK REAL
  -------------------------------- */
  const getStockFor = useCallback((codigo: string): number => {
    const productos = menuService.getCached();
    const p = productos.find((prod) => prod.id === codigo);
    return p?.stock ?? 0;
  }, []);

  /* -------------------------------
      SUMA TOTAL DE CANTIDADES
  -------------------------------- */
  const sumCantidadProducto = useCallback(
    (codigo: string, itemsLista: CartItem[]) => {
      return itemsLista
        .filter((i) => i.codigo === codigo)
        .reduce((acc, i) => acc + i.cantidad, 0);
    },
    []
  );

  /* -------------------------------
      ADD ITEM (respeta stock real)
  -------------------------------- */
  const addItem = useCallback(
    (item: CartItem) => {
      const stockReal = 0;
      if (stockReal <= 0) return;

      const normalizedMsg = (item.mensaje ?? "").trim().toLowerCase();
      const updated = [...items];

      const totalActual = sumCantidadProducto(item.codigo, items);
      const totalLuego = totalActual + item.cantidad;

      if (totalLuego > stockReal) {
        const disponible = stockReal - totalActual;
        if (disponible <= 0) return;
        item = { ...item, cantidad: disponible };
      }

      const idx = updated.findIndex(
        (i) =>
          i.codigo === item.codigo &&
          (i.mensaje ?? "").trim().toLowerCase() === normalizedMsg
      );

      if (idx >= 0) {
        updated[idx] = {
          ...updated[idx],
          cantidad: updated[idx].cantidad + item.cantidad,
        };
      } else {
        updated.push(item);
      }

      sync(updated);
    },
    [items, sync, getStockFor, sumCantidadProducto]
  );

  /* -------------------------------
      UPDATE QUANTITY
  -------------------------------- */
  const updateQuantity = useCallback(
    (codigo: string, mensaje: string | null, cantidad: number) => {
      const stockReal = getStockFor(codigo);
      if (stockReal <= 0) return;

      const normalizedMsg = (mensaje ?? "").trim().toLowerCase();
      const updated = [...items];

      const totalOtras = updated
        .filter((i) => {
          const msg = (i.mensaje ?? "").trim().toLowerCase();
          return i.codigo === codigo && msg !== normalizedMsg;
        })
        .reduce((acc, i) => acc + i.cantidad, 0);

      const max = stockReal - totalOtras;

      let nuevaCantidad = cantidad;
      if (nuevaCantidad < 1) nuevaCantidad = 1;
      if (nuevaCantidad > max) nuevaCantidad = max;

      const result = updated.map((i) => {
        const msg = (i.mensaje ?? "").trim().toLowerCase();
        if (i.codigo === codigo && msg === normalizedMsg) {
          return { ...i, cantidad: nuevaCantidad };
        }
        return i;
      });

      sync(result);
    },
    [items, sync, getStockFor]
  );

  /* -------------------------------
      REMOVE ITEM
  -------------------------------- */
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

  /* -------------------------------
      CLEAR CART
  -------------------------------- */
  const clear = useCallback(() => {
    sync([]);
    clearStorage();
  }, [sync]);

  /* -------------------------------
      CALCULAR TOTALES + DESCUENTOS
  -------------------------------- */
  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (acc, i) => acc + i.precio * i.cantidad,
      0
    );

    const discounts = calculateUserDiscounts(storedUser, items, subtotal);

    return {
      subtotal,
      totalCantidad: items.reduce((a, i) => a + i.cantidad, 0),
      totalPrecio: discounts.finalPrice,
      discountAmount: discounts.totalDiscount,
      discountDescription: discounts.description,
    };
  }, [items, storedUser]);

  return (
    <CartContext.Provider
      value={{
        items,
        totals,
        addItem,
        removeItem,
        updateQuantity,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
