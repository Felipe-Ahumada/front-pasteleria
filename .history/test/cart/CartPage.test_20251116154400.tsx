import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import CartPage from "@/pages/cart/CartPage";
import { CartProvider } from "@/context/cart/CartProvider";
import { AuthProvider } from "@/context/auth";
import { ThemeProvider } from "@/context/theme";

const setup = () =>
  render(
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <CartPage />
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );

describe("CartPage – Snapshot", () => {
  it("coincide con la UI esperada", () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });
});
