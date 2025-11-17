// hooks/useMenuPage.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import { menuService, MENU_CACHE_UPDATED_EVENT } from "@/service/menuService";
import type { Producto } from "@/service/menuService";
import { validatePriceFilters } from "@/utils/validations/filtersValidations";
import type { ValidationErrors } from "@/utils/validations/types";
import type { FilterValues } from "@/utils/validations/filtersValidations";
import type { OrderOption } from "@/components/menu/MenuFilters";

// Tipo final para UI
export type LoadedProduct = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria: string;
  stock: number;
};

export function useMenuPage() {
  /** -----------------------------
   * Estado principal
   * ----------------------------- */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);

  /** -----------------------------
   * Filtros
   * ----------------------------- */
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const [selectedProduct, setSelectedProduct] = useState<string | "all">("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState<OrderOption>("name-asc");

  const [filterErrors, setFilterErrors] = useState<
    ValidationErrors<FilterValues>
  >({});

  /** -----------------------------
   * 1) Cargar productos del service
   * ----------------------------- */
  const loadProductos = useCallback(() => {
    try {
      const data = menuService.getActive();
      setProductos(data);
      setError(null);
      setLoading(false);
    } catch {
      setError("No fue posible cargar el menú.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProductos();

    if (typeof window === "undefined") return;

    const handler = () => loadProductos();
    window.addEventListener(MENU_CACHE_UPDATED_EVENT, handler);

    return () => {
      window.removeEventListener(MENU_CACHE_UPDATED_EVENT, handler);
    };
  }, [loadProductos]);

  /** -----------------------------
   * 2) Categorías únicas
   * ----------------------------- */
  const categories = useMemo(() => {
    const set = new Set<string>();
    productos.forEach((p) => set.add(p.categoria));
    return Array.from(set); // string[]
  }, [productos]);

  /** -----------------------------
   * 3) Opciones de productos
   * ----------------------------- */
  const productOptions = useMemo(() => {
    const map = new Map<string, Producto>();
    productos.forEach((p) => {
      if (!map.has(p.id)) map.set(p.id, p);
    });
    return Array.from(map.values()).sort((a, b) =>
      a.nombre.localeCompare(b.nombre, "es")
    );
  }, [productos]);

  /** -----------------------------
   * 4) Filtrado
   * ----------------------------- */
  const filteredProducts = useMemo(() => {
    let result = [...productos];

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.categoria === selectedCategory);
    }

    if (selectedProduct !== "all") {
      result = result.filter((p) => p.id === selectedProduct);
    }

    const min = minPrice.trim() ? Number(minPrice) : null;
    const max = maxPrice.trim() ? Number(maxPrice) : null;

    if (min !== null) result = result.filter((p) => p.precio >= min);
    if (max !== null) result = result.filter((p) => p.precio <= max);

    switch (sortOrder) {
      case "name-asc":
        result.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
        break;
      case "name-desc":
        result.sort((a, b) => b.nombre.localeCompare(a.nombre, "es"));
        break;
      case "price-asc":
        result.sort((a, b) => a.precio - b.precio);
        break;
      case "price-desc":
        result.sort((a, b) => b.precio - a.precio);
        break;
    }

    return result;
  }, [
    productos,
    selectedCategory,
    selectedProduct,
    minPrice,
    maxPrice,
    sortOrder,
  ]);

  const totalProductos = filteredProducts.length;

  /** -----------------------------
   * 5) Handlers de filtros
   * ----------------------------- */
  const handleMinPriceChange = (value: string) => {
    setMinPrice(value);
    const v = validatePriceFilters({ precioMin: value, precioMax: maxPrice });
    setFilterErrors(v.errors);
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPrice(value);
    const v = validatePriceFilters({ precioMin: minPrice, precioMax: value });
    setFilterErrors(v.errors);
  };

  const onCategoryChange = (value: string | "all") => {
    setSelectedCategory(value);
    setSelectedProduct("all");
  };

  const onProductChange = (value: string | "all") => {
    setSelectedProduct(value);
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedProduct("all");
    setMinPrice("");
    setMaxPrice("");
    setSortOrder("name-asc");
    setFilterErrors({});
  };

  /** -----------------------------
   * 6) Conversion a LoadedProduct (UI)
   * ----------------------------- */
  const normalizedProducts: LoadedProduct[] = filteredProducts.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: p.precio,
    imagen: p.imagen,
    categoria: p.categoria,
    stock: p.stock,
  }));

  /** -----------------------------
   * RETORNO FINAL
   * ----------------------------- */
  return {
    loading,
    error,

    filteredProducts: normalizedProducts,
    totalProductos,

    categories,       // string[]
    productOptions,   // Producto[]

    selectedCategory,
    selectedProduct,
    minPrice,
    maxPrice,
    sortOrder,
    filterErrors,

    onCategoryChange,
    onProductChange,

    setSortOrder,
    handleMinPriceChange,
    handleMaxPriceChange,
    resetFilters,
  };
}
