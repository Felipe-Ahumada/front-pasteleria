import type { ChangeEvent } from "react";
import type { FilterValues } from "@/hooks/menu/useMenuFilters";
import type { Categoria } from "@/service/menuService";

export type OrderOption = "name-asc" | "name-desc" | "price-asc" | "price-desc";

export interface MenuFiltersProps {
  categories: Categoria[];
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
    <div className="card bg-cocoa-glass border-gold shadow-lg mb-4 p-3">
      <div className="row g-3">
        {/* Categorías */}
        <div className="col-md-3">
          <label className="form-label fw-bold text-gold">Categoría</label>
          <select
            className="form-select bg-cocoa-input"
            value={selectedCategory ?? ""}
            onChange={(e) =>
              onCategoryChange(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">Todas</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Productos */}
        <div className="col-md-3">
          <label className="form-label fw-bold text-gold">Producto</label>
          <select
            className="form-select bg-cocoa-input"
            value={selectedProductCode ?? ""}
            onChange={(e) => onProductChange(e.target.value || null)}
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
          <label className="form-label fw-bold text-gold">Precio mínimo</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={7}
            placeholder="Ej: 5000"
            className={`form-control bg-cocoa-input ${
              errors.minPrice ? "is-invalid" : ""
            }`}
            value={minPrice}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const val = e.target.value.replace(/\D/g, "");
              if (val === "") {
                onMinPriceChange("");
              } else {
                onMinPriceChange(Number(val));
              }
            }}
          />
          {errors.minPrice && (
            <div className="invalid-feedback">{errors.minPrice}</div>
          )}
        </div>

        {/* Precio máximo */}
        <div className="col-md-2">
          <label className="form-label fw-bold text-gold">Precio máximo</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={7}
            placeholder="Ej: 20000"
            className={`form-control bg-cocoa-input ${
              errors.maxPrice ? "is-invalid" : ""
            }`}
            value={maxPrice}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const val = e.target.value.replace(/\D/g, "");
              if (val === "") {
                onMaxPriceChange("");
              } else {
                onMaxPriceChange(Number(val));
              }
            }}
          />
          {errors.maxPrice && (
            <div className="invalid-feedback">{errors.maxPrice}</div>
          )}
        </div>

        {/* Orden */}
        <div className="col-md-2">
          <label className="form-label fw-bold text-gold">Ordenar por</label>
          <select
            className="form-select bg-cocoa-input"
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
        <button className="btn btn-mint fw-bold" onClick={onReset}>
          <i className="bi bi-eraser me-2"></i>
          Limpiar filtros
        </button>
      </div>
    </div>
  );
};

export default MenuFilters;
