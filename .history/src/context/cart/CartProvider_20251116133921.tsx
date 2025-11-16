// context/cart/CartProvider.tsx
import { useState, useCallback, useMemo } from "react";
import { CartContext, type CartItem } from "./CartContext";
import {
  getCart,
  setCart,
  clearCart as clearStorage,
} from "@/utils/storage/cartStorage";
import { menuService } from "@/service/menuService";

interface Props {
  children: React.ReactNode;
}

export const CartProvider = ({ children }: Props) => {
  const [items, setItems] = useState<CartItem[]>(() => getCart());

  /** Sincroniza estado + localStorage */
  const sync = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
    setCart(newItems);
  }, []);

  /** Obtiene el stock real desde el menú */
  const getStockFor = useCallback((codigo: string): number => {
    const productos = menuService.getCached();
    const p = productos.find((prod) => prod.id === codigo);
    return p?.stock ?? 0;
  }, []);

  /** Suma total de cantidades del producto (todas las variantes) */
  const sumCantidadProducto = useCallback(
    (codigo: string, itemsLista: CartItem[]) => {
      return itemsLista
        .filter((i) => i.codigo === codigo)
        .reduce((acc, i) => acc + i.cantidad, 0);
    },
    []
  );

  /* ===========================================================
     ADD ITEM (validación de stock global incluida)
  ============================================================ */
  const addItem = useCallback(
    (item: CartItem) => {
      const stockReal = getStockFor(item.codigo);
      if (stockReal <= 0) return;

      const normalizedMsg = (item.mensaje ?? "").trim().toLowerCase();
      const updated = [...items];

      const totalActual = sumCantidadProducto(item.codigo, items);
      const totalDespuesAgregar = totalActual + item.cantidad;

      // Si supera stock global → ajustar
      if (totalDespuesAgregar > stockReal) {
        const disponible = stockReal - totalActual;
        if (disponible <= 0) return;
        item = { ...item, cantidad: disponible };
      }

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
    [items, sync, getStockFor, sumCantidadProducto]
  );

  /* ===========================================================
     UPDATE QUANTITY (validación global)
  ============================================================ */
  const updateQuantity = useCallback(
    (codigo: string, mensaje: string | null, cantidad: number) => {
      const stockReal = getStockFor(codigo);
      if (stockReal <= 0) return;

      const normalizedMsg = (mensaje ?? "").trim().toLowerCase();
      const updated = [...items];

      // Suma de cantidades de otras variantes del mismo producto
      const totalOtras = updated
        .filter((i) => {
          const msg = (i.mensaje ?? "").trim().toLowerCase();
          return i.codigo === codigo && msg !== normalizedMsg;
        })
        .reduce((acc, i) => acc + i.cantidad, 0);

      const maxParaEstaVariante = stockReal - totalOtras;

      let nuevaCantidad = cantidad;
      if (nuevaCantidad < 1) nuevaCantidad = 1;
      if (nuevaCantidad > maxParaEstaVariante)
        nuevaCantidad = maxParaEstaVariante;

      const finalItems = updated.map((i) => {
        const msg = (i.mensaje ?? "").trim().toLowerCase();
        if (i.codigo === codigo && msg === normalizedMsg) {
          return { ...i, cantidad: nuevaCantidad };
        }
        return i;
      });

      sync(finalItems);
    },
    [items, sync, getStockFor]
  );

  /* ===========================================================
     REMOVE ITEM
  ============================================================ */
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

  /* ===========================================================
     CLEAR CART
  ============================================================ */
  const clear = useCallback(() => {
    sync([]);
    clearStorage();
  }, [sync]);

  /* ===========================================================
     TOTALS
  ============================================================ */
  const totals = useMemo(
    () => ({
      totalCantidad: items.reduce((acc, i) => acc + i.cantidad, 0),
      totalPrecio: items.reduce(
        (acc, i) => acc + i.precio * i.cantidad,
        0
      ),
    }),
    [items]
  );

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
