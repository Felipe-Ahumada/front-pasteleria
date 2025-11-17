// components/menu/MenuFilters.tsx
import type { ChangeEvent } from "react";
import type { FilterValues } from "@/hooks/menu/useMenuFilters";

export type OrderOption = "name-asc" | "name-desc" | "price-asc" | "price-desc";

export interface MenuFiltersProps {
  categories: { id_categoria: number; nombre_categoria: string }[];
  productOptions: { codigo_producto: string; nombre_producto: string }[];

  orderOptions: { value: OrderOption; label: string }[];

  selectedCategory: number | null;
  selectedProductCode: string | null;

  minPrice: number | "";
  maxPrice: number | "";

  sortOrder: OrderOption;
  errors: Partial<Record<keyof FilterValues, string>>;

  onCategoryChange: (value: number | null) => void;
  onProductChange: (value: string | null) => void;
  onMinPriceChange: (value: number | "") => void;
  onMaxPriceChange: (value: number | "") => void;
  onSortChange: (value: OrderOption) => void;

  onReset: () => void;
}

const MenuFilters = ({
  categories,
  productOptions,
  orderOptions,

  selectedCategory,
  selectedProductCode,
  minPrice,
  maxPrice,
  sortOrder,
  errors,

  onCategoryChange,
  onProductChange,
  onMinPriceChange,
  onMaxPriceChange,
  onSortChange,
  onReset,
}: MenuFiltersProps) => {
  return (
    <div className="card card-soft shadow-soft mb-4 p-3">
      <div className="row g-3">
        {/* Categorías */}
        <div className="col-md-3">
          <label className="form-label fw-semibold">Categoría</label>
          <select
            className="form-select"
            value={selectedCategory ?? ""}
            onChange={(e) =>
              onCategoryChange(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">Todas</option>
            {categories.map((c) => (
              <option key={c.id_categoria} value={c.id_categoria}>
                {c.nombre_categoria}
              </option>
            ))}
          </select>
        </div>

        {/* Productos */}
        <div className="col-md-3">
          <label className="form-label fw-semibold">Producto</label>
          <select
            className="form-select"
            value={selectedProductCode ?? ""}
            onChange={(e) =>
              onProductChange(e.target.value || null)
            }
          >
            <option value="">Todos</option>
            {productOptions.map((p) => (
              <option key={p.codigo_producto} value={p.codigo_producto}>
                {p.nombre_producto}
              </option>
            ))}
          </select>
        </div>

        {/* Precio mínimo */}
        <div className="col-md-2">
          <label className="form-label fw-semibold">Precio mínimo</label>
          <input
            type="number"
            min={0}
            className={`form-control ${errors.minPrice ? "is-invalid" : ""}`}
            value={minPrice}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const v = e.target.value;
              onMinPriceChange(v === "" ? "" : Number(v));
            }}
          />
          {errors.minPrice && (
            <div className="invalid-feedback">{errors.minPrice}</div>
          )}
        </div>

        {/* Precio máximo */}
        <div className="col-md-2">
          <label className="form-label fw-semibold">Precio máximo</label>
          <input
            type="number"
            min={0}
            className={`form-control ${errors.maxPrice ? "is-invalid" : ""}`}
            value={maxPrice}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const v = e.target.value;
              onMaxPriceChange(v === "" ? "" : Number(v));
            }}
          />
          {errors.maxPrice && (
            <div className="invalid-feedback">{errors.maxPrice}</div>
          )}
        </div>

        {/* Orden */}
        <div className="col-md-2">
          <label className="form-label fw-semibold">Ordenar por</label>
          <select
            className="form-select"
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value as OrderOption)}
          >
            {orderOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Botón reset */}
      <div className="text-end mt-3">
        <button className="btn btn-mint" onClick={onReset}>
          Limpiar filtros
        </button>
      </div>
    </div>
  );
};

export default MenuFilters;
