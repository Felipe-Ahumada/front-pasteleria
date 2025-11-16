import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import CartPage from "@/pages/cart/CartPage";
import { AuthProvider } from "@/context/auth";
import { ThemeProvider } from "@/context/theme";
import { CartProvider } from "@/context/cart";
import { MemoryRouter } from "react-router-dom";

const setup = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <ThemeProvider>
          <CartProvider>
            <CartPage />
          </CartProvider>
        </ThemeProvider>
      </AuthProvider>
    </MemoryRouter>
  );

describe("CartPage – Snapshot", () => {
  it("coincide con la UI esperada", () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });
});


/*
Este es un snapshot
*/