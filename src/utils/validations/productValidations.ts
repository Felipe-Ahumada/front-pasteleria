import type { Producto } from "@/service/menuService";

export interface ProductValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof Producto, string>>;
}

export const validateProduct = (data: Producto): ProductValidationResult => {
  const errors: Partial<Record<keyof Producto, string>> = {};

  // Código obligatorio
  const id = data.id.trim().toUpperCase();
  const codeRegex = /^[A-Z]{2,3}[0-9]{3}$/;

  if (!id) {
    errors.id = "El código es obligatorio.";
  } else if (!codeRegex.test(id)) {
    errors.id =
      "Formato inválido. Ej: TC001, PG001 (2–3 letras + 3 números).";
  }

  // Nombre obligatorio
  if (!data.nombre.trim()) {
    errors.nombre = "El nombre es obligatorio.";
  }

  // Precio mínimo 1000
  if (data.precio === undefined || data.precio === null) {
    errors.precio = "El precio es obligatorio.";
  } else if (data.precio < 1000) {
    errors.precio = "El precio debe ser mayor o igual a 1000.";
  }

  // Stock
  if (data.stock === undefined || data.stock === null) {
    errors.stock = "El stock es obligatorio.";
  } else if (data.stock < 0) {
    errors.stock = "El stock no puede ser negativo.";
  }

  // Stock crítico
  if (data.stock_critico === undefined || data.stock_critico === null) {
    errors.stock_critico = "El stock crítico es obligatorio.";
  } else if (data.stock_critico < 0) {
    errors.stock_critico = "El stock crítico no puede ser negativo.";
  } else if (data.stock_critico > data.stock) {
    errors.stock_critico = "El stock crítico no puede ser mayor al stock.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
