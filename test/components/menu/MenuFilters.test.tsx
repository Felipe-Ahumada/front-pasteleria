import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MenuFilters from "@/components/menu/MenuFilters";
import type { MenuFiltersProps } from "@/components/menu/MenuFilters";

describe("MenuFilters", () => {
  const mockProps: MenuFiltersProps = {
    categories: [
      { id_categoria: 1, nombre_categoria: "Pasteles" },
      { id_categoria: 2, nombre_categoria: "Bebidas" },
    ],
    productOptions: [
      { codigo_producto: "P001", nombre_producto: "Torta Chocolate" },
      { codigo_producto: "P002", nombre_producto: "Jugo Natural" },
    ],
    orderOptions: [
      { value: "name-asc", label: "Nombre (A-Z)" },
      { value: "price-asc", label: "Precio (Menor a Mayor)" },
    ],
    selectedCategory: null,
    selectedProductCode: null,
    minPrice: "",
    maxPrice: "",
    sortOrder: "name-asc",
    errors: {},
    onCategoryChange: vi.fn(),
    onProductChange: vi.fn(),
    onMinPriceChange: vi.fn(),
    onMaxPriceChange: vi.fn(),
    onSortChange: vi.fn(),
    onReset: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with initial props", () => {
    render(<MenuFilters {...mockProps} />);

    expect(screen.getByText("Categoría")).toBeInTheDocument();
    expect(screen.getByText("Producto")).toBeInTheDocument();
    expect(screen.getByText("Precio mínimo")).toBeInTheDocument();
    expect(screen.getByText("Precio máximo")).toBeInTheDocument();
    expect(screen.getByText("Ordenar por")).toBeInTheDocument();
    expect(screen.getByText("Limpiar filtros")).toBeInTheDocument();
  });

  it("calls onCategoryChange when category is selected", () => {
    render(<MenuFilters {...mockProps} />);
    const selects = screen.getAllByRole("combobox");
    const categorySelect = selects[0];

    fireEvent.change(categorySelect, { target: { value: "1" } });
    expect(mockProps.onCategoryChange).toHaveBeenCalledWith(1);
  });

  it("calls onCategoryChange with null when category is cleared", () => {
    render(<MenuFilters {...mockProps} />);
    const selects = screen.getAllByRole("combobox");
    const categorySelect = selects[0];

    fireEvent.change(categorySelect, { target: { value: "" } });
    expect(mockProps.onCategoryChange).toHaveBeenCalledWith(null);
  });

  it("calls onProductChange when product is selected", () => {
    render(<MenuFilters {...mockProps} />);
    const selects = screen.getAllByRole("combobox");
    const productSelect = selects[1];

    fireEvent.change(productSelect, { target: { value: "P001" } });
    expect(mockProps.onProductChange).toHaveBeenCalledWith("P001");
  });

  it("calls onProductChange with null when product is cleared", () => {
    render(<MenuFilters {...mockProps} />);
    const selects = screen.getAllByRole("combobox");
    const productSelect = selects[1];

    fireEvent.change(productSelect, { target: { value: "" } });
    expect(mockProps.onProductChange).toHaveBeenCalledWith(null);
  });

  it("calls onMinPriceChange when min price input changes", () => {
    render(<MenuFilters {...mockProps} />);
    // Inputs type number
    const inputs = screen.getAllByRole("spinbutton");
    const minPriceInput = inputs[0];

    fireEvent.change(minPriceInput, { target: { value: "1000" } });
    expect(mockProps.onMinPriceChange).toHaveBeenCalledWith(1000);
  });

  it("calls onMinPriceChange with empty string when input is cleared", () => {
    render(<MenuFilters {...mockProps} minPrice={1000} />);
    const inputs = screen.getAllByRole("spinbutton");
    const minPriceInput = inputs[0];

    fireEvent.change(minPriceInput, { target: { value: "" } });
    expect(mockProps.onMinPriceChange).toHaveBeenCalledWith("");
  });

  it("calls onMaxPriceChange when max price input changes", () => {
    render(<MenuFilters {...mockProps} />);
    const inputs = screen.getAllByRole("spinbutton");
    const maxPriceInput = inputs[1];

    fireEvent.change(maxPriceInput, { target: { value: "5000" } });
    expect(mockProps.onMaxPriceChange).toHaveBeenCalledWith(5000);
  });

  it("calls onMaxPriceChange with empty string when input is cleared", () => {
    render(<MenuFilters {...mockProps} maxPrice={5000} />);
    const inputs = screen.getAllByRole("spinbutton");
    const maxPriceInput = inputs[1];

    fireEvent.change(maxPriceInput, { target: { value: "" } });
    expect(mockProps.onMaxPriceChange).toHaveBeenCalledWith("");
  });

  it("calls onSortChange when sort order changes", () => {
    render(<MenuFilters {...mockProps} />);
    const selects = screen.getAllByRole("combobox");
    const sortSelect = selects[2];

    fireEvent.change(sortSelect, { target: { value: "price-asc" } });
    expect(mockProps.onSortChange).toHaveBeenCalledWith("price-asc");
  });

  it("calls onReset when reset button is clicked", () => {
    render(<MenuFilters {...mockProps} />);
    const resetButton = screen.getByText("Limpiar filtros");

    fireEvent.click(resetButton);
    expect(mockProps.onReset).toHaveBeenCalled();
  });

  it("displays error messages when present", () => {
    const propsWithErrors = {
      ...mockProps,
      errors: {
        minPrice: "El precio mínimo no es válido",
        maxPrice: "El precio máximo no es válido",
      },
    };
    render(<MenuFilters {...propsWithErrors} />);

    expect(
      screen.getByText("El precio mínimo no es válido")
    ).toBeInTheDocument();
    expect(
      screen.getByText("El precio máximo no es válido")
    ).toBeInTheDocument();
  });
});
