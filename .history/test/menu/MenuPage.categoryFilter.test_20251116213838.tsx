// test/menu/MenuPage.categoryFilter.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import MenuPage from "@/pages/menu/MenuPage";

import { AuthProvider } from "@/context/auth";
import { ThemeProvider } from "@/context/theme";
import { CartProvider } from "@/context/cart";

// -------------------------------
// MOCKS NECESARIOS
// -------------------------------

// Mock datos del menú
vi.mock("@/data/menu_datos.json", () => ({
  default: {
    categorias: [
      { id_categoria: 1, nombre_categoria: "Tortas" },
      { id_categoria: 2, nombre_categoria: "Cheesecakes" },
    ],
  },
}));

// Mock menuService
vi.mock("@/service/menuService", () => ({
  menuService: {
    getCached: () => [
      {
        id: "P1",
        nombre: "Torta Chocolate",
        descripcion: "Rica torta",
        precio: 5000,
        imagen: "",
        categoria: "Tortas",
        stock: 10,
      },
      {
        id: "P2",
        nombre: "Cheesecake Frutilla",
        descripcion: "Delicioso",
        precio: 4500,
        imagen: "",
        categoria: "Cheesecakes",
        stock: 5,
      },
    ],
  },
}));

// Mock useAuth (CartProvider lo necesita)
vi.mock("@/hooks/useAuth", () => ({
  default: () => ({
    user: { id: "1", email: "test@duoc.cl" },
  }),
}));

// -------------------------------
// TEST
// -------------------------------

const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <ThemeProvider>
          <CartProvider>{ui}</CartProvider>
        </ThemeProvider>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe("MenuPage – filtro por categoría", () => {
  it("filtra correctamente por categoría", async () => {
    const user = userEvent.setup();

    renderWithProviders(<MenuPage />);

    // Ambos productos visibles al inicio
    expect(screen.getByText("Torta Chocolate")).toBeTruthy();
    expect(screen.getByText("Cheesecake Frutilla")).toBeTruthy();

    // Seleccionar categoría "Tortas" (id_categoria = 1)
    const selectCategoria = screen.getByLabelText(/categoría/i);

    await user.selectOptions(selectCategoria, "1");

    // Sólo debería quedar la Torta
    expect(screen.getByText("Torta Chocolate")).toBeTruthy();
    expect(screen.queryByText("Cheesecake Frutilla")).toBeNull();
  });
});
