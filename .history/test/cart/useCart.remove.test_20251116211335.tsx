// test/cart/useCart.remove.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { CartProvider } from "@/context/cart";
import { useCart } from "@/hooks/useCart";
import type { PropsWithChildren } from "react";

// 🧹 Reiniciar localStorage antes de cada test
beforeEach(() => {
  localStorage.clear();
});

// 🔥 Mock correcto de useAuth
vi.mock("@/hooks/useAuth", () => ({
  __esModule: true,
  default: () => ({
    user: { id: "1", nombre: "Usuario Test" }
  }),
  useAuth: () => ({
    user: { id: "1", nombre: "Usuario Test" }
  })
}));

// 🔥 Mock de userService.getById (OBLIGATORIO)
vi.mock("@/service/userService", () => ({
  userService: {
    getById: () => ({
      id: "1",
      nombre: "Usuario Test",
      apellidos: "Demo",
      correo: "demo@test.com",
      tipoUsuario: "Cliente"
    })
  }
}));

// Wrapper real
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
        imagen: ""
      });
    });

    // 👍 AHORA sí debería ser 1
    expect(result.current.items.length).toBe(1);

    // Eliminar item
    act(() => {
      result.current.removeItem("A1");
    });

    expect(result.current.items.length).toBe(0);
  });
});
