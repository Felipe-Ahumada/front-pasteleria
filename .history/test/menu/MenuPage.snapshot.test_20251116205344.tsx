// tests/MenuPage.snapshot.test.tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import MenuPage from "@/pages/menu/MenuPage";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@/context/theme";

describe("MenuPage – Snapshot", () => {
  it("debe coincidir con la UI esperada", () => {
    const { asFragment } = render(
      <MemoryRouter>
        <ThemeProvider>
          <MenuPage />
        </ThemeProvider>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
