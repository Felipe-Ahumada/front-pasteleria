import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import MenuPage from "@/pages/menu/MenuPage";
import { AuthProvider } from "@/context/auth";
import { ThemeProvider } from "@/context/theme";
import { CartProvider } from "@/context/cart";

const setup = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <ThemeProvider>
          <CartProvider>
            <MenuPage />
          </CartProvider>
        </ThemeProvider>
      </AuthProvider>
    </MemoryRouter>
  );

describe("MenuPage – Snapshot", () => {
  it("debe coincidir con la UI esperada", () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });
});
