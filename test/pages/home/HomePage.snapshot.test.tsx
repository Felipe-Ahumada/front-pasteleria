import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import HomePage from "@/pages/home/HomePage";

import { AuthProvider } from "@/context/auth";
import { ThemeProvider } from "@/context/theme";
import { CartProvider } from "@/context/cart";

const setup = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <ThemeProvider>
          <CartProvider>
            <HomePage />
          </CartProvider>
        </ThemeProvider>
      </AuthProvider>
    </MemoryRouter>
  );

describe("HomePage – Snapshot", () => {
  it("coincide con la UI esperada", () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });
});
