// hooks/menu/useMenuFilters.ts
import { useMemo, useState } from "react";

export type OrderOption =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc";

export interface FilterValues {
  category: number | null;
  productCode: string | null;
  minPrice: number | "";
  maxPrice: number | "";
  sortOrder: OrderOption;
}

export type FilterErrors = Partial<Record<keyof FilterValues, string>>;

export interface EnrichedProduct {
  codigo_producto: string;
  nombre_producto: string;
  precio_producto: number;
  imagen_producto: string;
  descripción_producto: string;

  categoriaId: number;
  categoriaNombre: string;

  stock: number; // ← obligatorio
}

export function useMenuFilters(
  all: EnrichedProduct[],
  collator: Intl.Collator
) {
  // Estado de filtros
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedProductCode, setSelectedProductCode] = useState<
    string | null
  >(null);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [sortOrder, setSortOrder] = useState<OrderOption>("name-asc");

  // Errores de validación
  const [errors, setErrors] = useState<FilterErrors>({});

  // Opciones de productos
  const productOptions = useMemo(() => {
    return all.map((p) => ({
      codigo_producto: p.codigo_producto,
      nombre_producto: p.nombre_producto,
    }));
  }, [all]);

  // Aplicar filtros
  const filteredProducts = useMemo(() => {
    const validationErrors: FilterErrors = {};

    // validación precios
    if (minPrice !== "" && maxPrice !== "" && minPrice > maxPrice) {
      validationErrors.minPrice = "El mínimo no puede ser mayor que el máximo";
      validationErrors.maxPrice = "El máximo no puede ser menor que el mínimo";
    }

    setErrors(validationErrors);

    let result = [...all];

    // filtro categoría
    if (selectedCategory !== null) {
      result = result.filter((p) => p.categoriaId === selectedCategory);
    }

    // filtro código
    if (selectedProductCode) {
      const code = selectedProductCode.trim().toLowerCase();
      result = result.filter((p) =>
        p.codigo_producto.toLowerCase().includes(code)
      );
    }

    // filtro precio min
    if (minPrice !== "") {
      result = result.filter((p) => p.precio_producto >= minPrice);
    }

    // filtro precio max
    if (maxPrice !== "") {
      result = result.filter((p) => p.precio_producto <= maxPrice);
    }

    // ordenamiento
    result.sort((a, b) => {
      switch (sortOrder) {
        case "name-asc":
          return collator.compare(a.nombre_producto, b.nombre_producto);
        case "name-desc":
          return collator.compare(b.nombre_producto, a.nombre_producto);

        case "price-asc":
          return a.precio_producto - b.precio_producto;
        case "price-desc":
          return b.precio_producto - a.precio_producto;

        default:
          return 0;
      }
    });

    return result;
  }, [
    all,
    selectedCategory,
    selectedProductCode,
    minPrice,
    maxPrice,
    sortOrder,
    collator,
  ]);

  // reset
  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedProductCode(null);
    setMinPrice("");
    setMaxPrice("");
    setSortOrder("name-asc");
    setErrors({});
  };

  return {
    // estados
    selectedCategory,
    selectedProductCode,
    minPrice,
    maxPrice,
    sortOrder,
    errors,

    // datos
    productOptions,
    filteredProducts,

    // handlers
    setSelectedProductCode,
    setSortOrder,
    handleCategoryChange: setSelectedCategory,
    handleMinPriceChange: setMinPrice,
    handleMaxPriceChange: setMaxPrice,
    handleProductChange: setSelectedProductCode,
    onProductChange: setSelectedProductCode,
    onSortChange: setSortOrder,

    resetFilters,
  };
}
