// tests/cart/useCart.remove.test.tsx
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { PropsWithChildren } from "react";

import { AuthProvider } from "@/context/auth";
import { ThemeProvider } from "@/context/theme";
import { CartProvider } from "@/context/cart";
import { useCart } from "@/hooks/useCart";

const wrapper = ({ children }: PropsWithChildren<object>) => (
  <AuthProvider>
    <ThemeProvider>
      <CartProvider>{children}</CartProvider>
    </ThemeProvider>
  </AuthProvider>
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
