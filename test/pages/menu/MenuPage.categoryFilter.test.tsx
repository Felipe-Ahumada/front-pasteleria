// test/menu/MenuPage.categoryFilter.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import MenuPage from "@/pages/menu/MenuPage";

import { AuthProvider } from "@/context/auth";
import { ThemeProvider } from "@/context/theme";
import { CartProvider } from "@/context/cart";

// -------- MOCKS --------

vi.mock("@/data/menu_datos.json", () => ({
  default: {
    categorias: [
      { id_categoria: 1, nombre_categoria: "Tortas" },
      { id_categoria: 2, nombre_categoria: "Cheesecakes" },
    ],
  },
}));

const mockedProducts = [
  {
    id: "P1",
    nombre: "Torta Chocolate",
    descripcion: "Rica torta",
    precio: 5000,
    imagen: "",
    categoria: "Tortas",
    stock: 10,
    activo: true,
  },
  {
    id: "P2",
    nombre: "Cheesecake Frutilla",
    descripcion: "Delicioso",
    precio: 4500,
    imagen: "",
    categoria: "Cheesecakes",
    stock: 5,
    activo: true,
  },
];

vi.mock("@/service/menuService", () => ({
  MENU_CACHE_UPDATED_EVENT: "menu:cache-updated",
  menuService: {
    getCached: () => mockedProducts,
    getActive: () => mockedProducts.filter((p) => p.activo !== false),
  },
}));

vi.mock("@/hooks/useAuth", () => ({
  default: () => ({
    user: { id: "1", email: "test@duoc.cl" },
  }),
}));

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

    // Ambos productos deben estar visibles inicialmente (solo tarjetas)
    expect(screen.getAllByRole("heading", { name: "Torta Chocolate" })).toHaveLength(1);
    expect(screen.getAllByRole("heading", { name: "Cheesecake Frutilla" })).toHaveLength(1);

    // Obtener <select> de "Categoría"
    const selectCategoria = screen.getAllByRole("combobox")[0];

    await user.selectOptions(selectCategoria, "1");

    // Torta Chocolate → visible
    expect(screen.getAllByRole("heading", { name: "Torta Chocolate" })).toHaveLength(1);

    // Cheesecake Frutilla → NO debe estar visible
    expect(screen.queryByRole("heading", { name: "Cheesecake Frutilla" })).toBeNull();
  });
});
