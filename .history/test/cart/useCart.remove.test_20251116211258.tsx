// test/cart/useCart.remove.test.tsx
import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { CartProvider } from "@/context/cart";
import { useCart } from "@/hooks/useCart";
import type { PropsWithChildren } from "react";

// 🔥 Mock correcto de useAuth (soporta default y named)
vi.mock("@/hooks/useAuth", () => ({
  __esModule: true,
  default: () => ({
    user: { id: "test-user", nombre: "Usuario Test" },
  }),
  useAuth: () => ({
    user: { id: "test-user", nombre: "Usuario Test" },
  }),
}));

// Wrapper solo CartProvider
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
