// test/menu/MenuPage.categoryFilter.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import MenuPage from "@/pages/menu/MenuPage";

// Mock de datos reales
vi.mock("@/data/menu_datos.json", () => ({
  default: {
    categorias: [
      {
        id_categoria: 1,
        nombre_categoria: "Tortas",
      },
      {
        id_categoria: 2,
        nombre_categoria: "Cheesecakes",
      },
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

describe("MenuPage – filtro por categoría", () => {
  it("filtra correctamente por categoría", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <MenuPage />
      </MemoryRouter>
    );

    // Ambos productos deben aparecer inicialmente
    expect(screen.getByText("Torta Chocolate")).toBeTruthy();
    expect(screen.getByText("Cheesecake Frutilla")).toBeTruthy();

    // Seleccionar categoría "Tortas"
    const select = screen.getByLabelText(/categoría/i);
    await user.selectOptions(select, "1"); // id_categoria: 1

    // Debe quedar solo la torta
    expect(screen.getByText("Torta Chocolate")).toBeTruthy();
    expect(screen.queryByText("Cheesecake Frutilla")).toBeNull();
  });
});