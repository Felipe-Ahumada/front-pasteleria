import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import ProductViewModal from "@/pages/admin/products/ProductViewModal";

describe("ProductViewModal – componente", () => {
  it("muestra nombre del producto", () => {
    const fakeProduct = {
      id: "TC001",
      nombre: "Torta de Chocolate",
      precio: 45000,
      descripcion: "Muy rica",
      categoria: "Tortas",
      imagen: "",
      imagenes_detalle: [],
      stock: 10,
      stock_critico: 3,
    };

    render(
      <ProductViewModal
        open={true}           // ← obligatorio
        onClose={() => {}}
        producto={fakeProduct} // ← nombre correcto
      />
    );

    expect(screen.getByText("Torta de Chocolate")).toBeTruthy();
  });
});
