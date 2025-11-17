// test/menu/MenuPage.categoryFilter.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AuthProvider } from "@/context/auth";
import { ThemeProvider } from "@/context/theme";
import { CartProvider } from "@/context/cart";

import MenuPage from "@/pages/menu/MenuPage";
import type { PropsWithChildren } from "react";

// ----------------------
//  MOCK menuService
// ----------------------
vi.mock("@/service/menuService", () => ({
  menuService: {
    getCached: () => [
      {
        id: "P1",
        nombre: "Torta Chocolate",
        descripcion: "Rica torta",
        precio: 10000,
        imagen: "img/catalogo/torta_chocolate.jpg",
        categoria: "Tortas Circulares",
        stock: 5,
      },
      {
        id: "P2",
        nombre: "Cheesecake Frutilla",
        descripcion: "Delicioso",
        precio: 8000,
        imagen: "img/catalogo/cheesecake.jpg",
        categoria: "Cheesecakes",
        stock: 4,
      },
    ],
  },
}));

// Mock imágenes
vi.mock("@/assets/images/catalog/torta_chocolate.jpg", () => "mock.jpg");
vi.mock("@/assets/images/catalog/cheesecake.jpg", () => "mock.jpg");

// Wrapper global 
const wrapper = ({ children }: PropsWithChildren<unknown>) => (
  <AuthProvider>
    <ThemeProvider>
      <CartProvider>{children}</CartProvider>
    </ThemeProvider>
  </AuthProvider>
);

describe("MenuPage – filtro por categoría", () => {
  it("filtra los productos según la categoría seleccionada", async () => {
    render(<MenuPage />, { wrapper });
    const user = userEvent.setup();

    // Aseguramos que están ambos productos al inicio
    expect(await screen.findByText("Torta Chocolate")).toBeTruthy();
    expect(await screen.findByText("Cheesecake Frutilla")).toBeTruthy();

    // Seleccionar categoría "Tortas Circulares"
    const categoriaSelect = screen.getByLabelText(/Categoría/i);
    await user.selectOptions(categoriaSelect, "Tortas Circulares");

    // Ahora NO debe aparecer el Cheesecake
    expect(screen.queryByText("Cheesecake Frutilla")).toBeNull();

    // Debe quedar solo la torta
    expect(screen.getByText("Torta Chocolate")).toBeTruthy();
  });
});
