// test/cart/useCart.updateQty.test.tsx
import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { PropsWithChildren } from "react";

import { AuthProvider } from "@/context/auth";
import { ThemeProvider } from "@/context/theme";
import { CartProvider } from "@/context/cart";
import { useCart } from "@/hooks/useCart";

// Mock useAuth
vi.mock("@/hooks/useAuth", () => ({
  default: () => ({
    user: { id: "1", email: "test@duoc.cl" },
  }),
}));

// Mock menuService
vi.mock("@/service/menuService", () => ({
  menuService: {
    getCached: () => [
      { id: "A1", nombre: "Torta", stock: 10 }
    ],
  },
}));

// Wrapper completo
const wrapper = ({ children }: PropsWithChildren<unknown>) => (
  <AuthProvider>
    <ThemeProvider>
      <CartProvider>{children}</CartProvider>
    </ThemeProvider>
  </AuthProvider>
);

describe("useCart – updateQuantity", () => {
  it("actualiza la cantidad correctamente", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({
        codigo: "A1",
        nombre: "Torta",
        precio: 4000,
        cantidad: 1,
        imagen: "",
      });
    });

    expect(result.current.items[0].cantidad).toBe(1);

    act(() => {
      result.current.updateQuantity("A1", null, 3);
    });

    expect(result.current.items[0].cantidad).toBe(3);
  });
});


/*
Funcionalidad
*/