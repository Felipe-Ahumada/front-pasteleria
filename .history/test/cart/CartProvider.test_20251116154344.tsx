// test/cart/CartProvider.test.ts
import { describe, it, expect } from "vitest";
import { CartProvider } from "@/context/cart/CartProvider";
import { renderHook, act } from "@testing-library/react";
import { useCart } from "@/hooks/useCart";
import { AuthProvider } from "@/context/auth";
import { ThemeProvider } from "@/context/theme";

// Helper para renderizar con providers
const setup = () => {
  const wrapper = ({ children }: any) => (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>{children}</CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
  return renderHook(() => useCart(), { wrapper });
};

describe("CartProvider – lógica del carrito", () => {
  it("agrega un producto al carrito", () => {
    const { result } = setup();

    act(() => {
      result.current.addItem({
        codigo: "TC001",
        nombre: "Torta Chocolate",
        precio: 10000,
        imagen: "x",
        cantidad: 1,
      });
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].cantidad).toBe(1);
  });

  it("no permite agregar más que el stock disponible", () => {
    const { result } = setup();

    // Simulación: stock = 5 (del menuService)
    act(() => {
      result.current.addItem({
        codigo: "TC001",
        nombre: "Torta Chocolate",
        precio: 10000,
        imagen: "x",
        cantidad: 10, // pide 10 → solo agrega 5
      });
    });

    expect(result.current.items[0].cantidad).toBe(5);
  });
});
