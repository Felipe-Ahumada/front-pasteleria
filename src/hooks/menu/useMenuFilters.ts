import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export type OrderOption = "name-asc" | "name-desc" | "price-asc" | "price-desc";

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

  stock: number;
}

export function useMenuFilters(
  all: EnrichedProduct[],
  collator: Intl.Collator
) {
  const [searchParams, setSearchParams] = useSearchParams();

  const STORAGE_KEY = "pasteleria-filters";

  const loadInitialState = () => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as FilterValues;
      }
    } catch (e) {
      console.warn("Error loading filters", e);
    }
    return null;
  };

  // Only run once on mount
  const savedState = useMemo(() => loadInitialState(), []);

  // Estado de filtros - Inicializar desde URL (prioridad) o Storage
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    () => {
      const param = searchParams.get("categoryId");
      if (param) return Number(param);
      return savedState?.category ?? null;
    }
  );

  const [selectedProductCode, setSelectedProductCode] = useState<string | null>(
    savedState?.productCode ?? null
  );
  const [minPrice, setMinPrice] = useState<number | "">(
    savedState?.minPrice ?? ""
  );
  const [maxPrice, setMaxPrice] = useState<number | "">(
    savedState?.maxPrice ?? ""
  );
  const [sortOrder, setSortOrder] = useState<OrderOption>(
    savedState?.sortOrder ?? "name-asc"
  );

  // Persistir cambios en Session Storage
  useEffect(() => {
    const stateToSave: FilterValues = {
      category: selectedCategory,
      productCode: selectedProductCode,
      minPrice,
      maxPrice,
      sortOrder,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [selectedCategory, selectedProductCode, minPrice, maxPrice, sortOrder]);

  // Sincronizar URL cuando cambia la categoría (Opcional pero buena UX)
  useEffect(() => {
    if (selectedCategory) {
      setSearchParams((prev) => {
        prev.set("categoryId", String(selectedCategory));
        return prev;
      });
    } else {
      setSearchParams((prev) => {
        prev.delete("categoryId");
        return prev;
      });
    }
  }, [selectedCategory, setSearchParams]);

  // Errores de validación
  const [errors, setErrors] = useState<FilterErrors>({});

  // Opciones de productos
  const productOptions = useMemo(() => {
    let products = all;
    if (selectedCategory !== null) {
      products = all.filter((p) => p.categoriaId === selectedCategory);
    }
    return products.map((p) => ({
      codigo_producto: p.codigo_producto,
      nombre_producto: p.nombre_producto,
    }));
  }, [all, selectedCategory]);

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

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setSelectedProductCode(null);
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
    handleCategoryChange,
    handleMinPriceChange: setMinPrice,
    handleMaxPriceChange: setMaxPrice,
    handleProductChange: setSelectedProductCode,
    onProductChange: setSelectedProductCode,
    onSortChange: setSortOrder,

    resetFilters,
  };
}
