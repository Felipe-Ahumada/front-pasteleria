// tests/useCart.remove.test.ts
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider } from "@/context/cart";
import { useCart } from "@/hooks/useCart";
import type { PropsWithChildren } from "react";

const wrapper = ({ children }: PropsWithChildren<object>) => (
  <CartProvider>{children}</CartProvider>
);

describe("useCart – removeItem", () => {
  it("elimina un item del carrito", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

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

    act(() => {
      result.current.removeItem("A1");
    });

    expect(result.current.items.length).toBe(0);
  });
});
