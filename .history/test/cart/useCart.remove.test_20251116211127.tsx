// test/cart/useCart.remove.test.tsx
import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { PropsWithChildren } from "react";

import { CartProvider } from "@/context/cart";
import { useCart } from "@/hooks/useCart";

// 🔥 MOCK: Simula que hay un usuario autenticado
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: "test-user", nombre: "Usuario Test" },
  }),
}));

// Wrapper solo con CartProvider (Auth ya está mockeado)
const wrapper = ({ children }: PropsWithChildren<object>) => (
  <CartProvider>{children}</CartProvider>
);

describe("useCart – removeItem", () => {
  it("elimina un item del carrito", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // Agregar item
    act(() => {
      result.current.addItem({
        codigo: "A1",
        nombre: "Producto",
        precio: 1000,
        cantidad: 1,
        imagen: "",
      });
    });

    expect(result.current.items.length).toBe(1);

    // Eliminar item
    act(() => {
      result.current.removeItem("A1");
    });

    expect(result.current.items.length).toBe(0);
  });
});
