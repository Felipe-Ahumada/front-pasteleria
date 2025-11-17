import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { PropsWithChildren } from "react";

import { AuthProvider } from "@/context/auth";
import { ThemeProvider } from "@/context/theme";
import { CartProvider } from "@/context/cart";
import { useCart } from "@/hooks/useCart";

// 🟩 1. MOCK MENU SERVICE para que getStockFor() devuelva stock > 0
vi.mock("@/service/menuService", () => ({
  menuService: {
    getCached: () => [
      {
        id: "A1",
        nombre: "Producto",
        stock: 10,
        stock_critico: 2,
      },
    ],
  },
}));

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

    // agregar item
    act(() => {
      result.current.addItem({
        codigo: "A1",
        nombre: "Producto",
        precio: 1000,
        cantidad: 1,
        imagen: "",
      });
    });

    // ahora SI es 1
    expect(result.current.items.length).toBe(1);

    // eliminar
    act(() => {
      result.current.removeItem("A1");
    });

    // ahora SI es 0
    expect(result.current.items.length).toBe(0);
  });
});