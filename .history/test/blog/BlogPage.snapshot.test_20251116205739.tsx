import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import BlogPage from "@/pages/blog/BlogPage";

import { AuthProvider } from "@/context/auth";
import { ThemeProvider } from "@/context/theme";
import { CartProvider } from "@/context/cart";
import { BlogProvider } from "@/context/blog/BlogProvider";

const setup = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <ThemeProvider>
          <CartProvider>
            <BlogProvider>
              <BlogPage />
            </BlogProvider>
          </CartProvider>
        </ThemeProvider>
      </AuthProvider>
    </MemoryRouter>
  );

describe("BlogPage – Snapshot", () => {
  it("renderiza correctamente la vista del blog", () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });
});
