import { useState, useCallback, useMemo, type ReactNode } from "react";
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
  children: ReactNode;
}

export const CartProvider = ({ children }: Props) => {
  const [items, setItems] = useState<CartItem[]>(() => getCart());
  const { user: authUser } = useAuth();

  /** Usuario completo desde localStorage (StoredUser) */
  const storedUser: StoredUser | null = authUser
    ? getLocalItem<StoredUser>(LOCAL_STORAGE_KEYS.activeUser)
    : null;

  /* -------------------------------
      SYNC ESTADO 
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
    (codigo: string, itemsLista: CartItem[]) =>
      itemsLista
        .filter((i) => i.codigo === codigo)
        .reduce((acc, i) => acc + i.cantidad, 0),
    []
  );

  /* -------------------------------
      ADD ITEM 
  -------------------------------- */
  const addItem = useCallback(
    (item: CartItem) => {
      const stockReal = getStockFor(item.codigo);
      if (stockReal <= 0) return;

      const msgNorm = (item.mensaje ?? "").trim().toLowerCase();
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
          (i.mensaje ?? "").trim().toLowerCase() === msgNorm
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
      UPDATE TIEMPO REAL
  -------------------------------- */
  const updateQuantity = useCallback(
    (codigo: string, mensaje: string | null, cantidad: number) => {
      const stockReal = getStockFor(codigo);
      if (stockReal <= 0) return;

      const msgNorm = (mensaje ?? "").trim().toLowerCase();
      const updated = [...items];

      const totalOtras = updated
        .filter((i) => {
          const m = (i.mensaje ?? "").trim().toLowerCase();
          return i.codigo === codigo && m !== msgNorm;
        })
        .reduce((acc, i) => acc + i.cantidad, 0);

      const max = stockReal - totalOtras;

      let nuevaCantidad = cantidad;
      if (nuevaCantidad < 1) nuevaCantidad = 1;
      if (nuevaCantidad > max) nuevaCantidad = max;

      const result = updated.map((i) => {
        const m = (i.mensaje ?? "").trim().toLowerCase();
        if (i.codigo === codigo && m === msgNorm) {
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
      const msgNorm = (mensaje ?? "").trim().toLowerCase();

      const updated = items.filter((i) => {
        const m = (i.mensaje ?? "").trim().toLowerCase();
        return !(i.codigo === codigo && m === msgNorm);
      });

      sync(updated);
    },
    [items, sync]
  );

  /* -------------------------------
      LIMPIAR EL CARRITO
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
      totalPrecio: subtotal, // precio real antes de descuentos
      discountAmount: discounts.totalDiscount,
      discountDescription: discounts.description,
      totalPagar: discounts.finalPrice, // precio final con descuento
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
