import {
  useState,
  useCallback,
  useMemo,
  type ReactNode,
  useEffect,
} from "react";
import { CartContext, type CartItem } from "./CartContext";

import {
  getCart,
  setCart,

  clearCart as clearStorage,
} from "@/utils/storage/cartStorage";

import { cartService } from "@/service/cartService";

import { menuService, type Producto } from "@/service/menuService";
import useAuth from "@/hooks/useAuth";
import { calculateUserDiscounts } from "@/utils/discounts/userDiscounts";

interface Props {
  children: ReactNode;
}

export const CartProvider = ({ children }: Props) => {
  const { user: authUser } = useAuth();
  const userId = authUser?.id ?? null;

  /* -------------------------------------
        ESTADO INICIAL DEL CARRITO 
     ------------------------------------- */
  const [items, setItems] = useState<CartItem[]>(() => getCart(userId));
  const [products, setProducts] = useState<Producto[]>([]);

  /* -------------------------------------
        CAMBIO DE USUARIO = CAMBIO DE CARRITO
     ------------------------------------- */
  /* -------------------------------------
        CAMBIO DE USUARIO = CAMBIO DE CARRITO
     ------------------------------------- */
  useEffect(() => {
    if (userId) {
      cartService.getCart().then(setItems).catch(console.error);
    } else {
      setItems(getCart(userId));
    }
  }, [userId]);

  /* -------------------------------------
        CARGAR PRODUCTOS PARA STOCK
     ------------------------------------- */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await menuService.getActive();
        setProducts(data);
      } catch (error) {
        console.error("Error loading products for cart stock check:", error);
      }
    };
    fetchProducts();
  }, []);

  /* -------------------------------------
        SYNC ESTADO 
     ------------------------------------- */
  const sync = useCallback(
    (newItems: CartItem[]) => {
      setItems(newItems);
      setCart(userId, newItems); // <<--- AHORA POR USUARIO
    },
    [userId]
  );

  /* -------------------------------------
        OBTENER STOCK REAL
     ------------------------------------- */
  const getStockFor = useCallback(
    (codigo: string): number => {
      const p = products.find((prod) => prod.id === codigo);
      if (!p || p.activo === false) return 0;
      return p.stock;
    },
    [products]
  );

  /* -------------------------------------
        SUMA TOTAL DE CANTIDADES
     ------------------------------------- */
  const sumCantidadProducto = useCallback(
    (codigo: string, itemsLista: CartItem[]) =>
      itemsLista
        .filter((i) => i.codigo === codigo)
        .reduce((acc, i) => acc + i.cantidad, 0),
    []
  );

  /* -------------------------------------
        ADD ITEM 
     ------------------------------------- */
  const addItem = useCallback(
    (item: CartItem) => {
      if (userId) {
        cartService
          .addItem(item.codigo, item.cantidad, item.mensaje || undefined)
          .then(setItems)
          .catch(console.error);
        return;
      }

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

  /* -------------------------------------
        UPDATE QUANTITY
     ------------------------------------- */
  const updateQuantity = useCallback(
    (codigo: string, mensaje: string | null, cantidad: number) => {
      if (userId) {
        const msgNorm = (mensaje ?? "").trim().toLowerCase();
        const itemToUpdate = items.find(
          (i) =>
            i.codigo === codigo &&
            (i.mensaje ?? "").trim().toLowerCase() === msgNorm
        );
        if (itemToUpdate?.backendId) {
          cartService
            .updateItem(itemToUpdate.backendId, cantidad)
            .then(setItems)
            .catch(console.error);
        }
        return;
      }

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

  /* -------------------------------------
        REMOVE ITEM
     ------------------------------------- */
  const removeItem = useCallback(
    (codigo: string, mensaje?: string | null) => {
      if (userId) {
        const msgNorm = (mensaje ?? "").trim().toLowerCase();
        const itemToRemove = items.find(
          (i) =>
            i.codigo === codigo &&
            (i.mensaje ?? "").trim().toLowerCase() === msgNorm
        );
        if (itemToRemove?.backendId) {
          cartService
            .removeItem(itemToRemove.backendId)
            .then(setItems)
            .catch(console.error);
        }
        return;
      }

      const msgNorm = (mensaje ?? "").trim().toLowerCase();

      const updated = items.filter((i) => {
        const m = (i.mensaje ?? "").trim().toLowerCase();
        return !(i.codigo === codigo && m === msgNorm);
      });

      sync(updated);
    },
    [items, sync]
  );

  /* -------------------------------------
        LIMPIAR EL CARRITO (POR USUARIO)
     ------------------------------------- */
  const clear = useCallback(() => {
    if (userId) {
      cartService.clearCart().then(() => setItems([])).catch(console.error);
      return;
    }
    sync([]);
    clearStorage(userId); // <<--- LIMPIA SOLO ESTE USUARIO
  }, [sync, userId]);

  /* -------------------------------------
        CALCULAR TOTALES + DESCUENTOS
     ------------------------------------- */
  const totals = useMemo(() => {
    const subtotal = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

    const discounts = calculateUserDiscounts(
      authUser?.discountInfo ?? null,
      items,
      subtotal
    );

    return {
      subtotal,
      totalCantidad: items.reduce((a, i) => a + i.cantidad, 0),
      totalPrecio: subtotal,
      discountAmount: discounts.totalDiscount,
      discountDescription: discounts.description,
      totalPagar: discounts.finalPrice,
    };
  }, [items, authUser]);

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
