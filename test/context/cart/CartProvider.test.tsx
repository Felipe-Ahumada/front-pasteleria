import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider } from "@/context/auth";
import { ThemeProvider } from "@/context/theme";
import { CartProvider } from "@/context/cart";
import { useCart } from "@/hooks/useCart";
import type { PropsWithChildren } from "react";

// Wrapper con typing correcto
const wrapper = ({ children }: PropsWithChildren) => (
  <AuthProvider>
    <ThemeProvider>
      <CartProvider>{children}</CartProvider>
    </ThemeProvider>
  </AuthProvider>
);

describe("CartProvider – lógica interna", () => {
  it("agrega un item correctamente", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({
        codigo: "TC001",
        nombre: "Torta",
        precio: 5000,
        imagen: "",
        cantidad: 1,
      });
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].cantidad).toBe(1);
  });
});


/*
Este es un test de funcionalidad donde estoy probando:
addItem


Como probar el test y saber que no me estoy engañando jskjskjs

 Cambia esto:
const stockReal = getStockFor(item.codigo);

por esto
const stockReal = 0;
*/