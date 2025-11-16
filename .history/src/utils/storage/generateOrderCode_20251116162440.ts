// src/utils/storage/generateOrderCode.ts

/**
 * Genera un código único para cada pedido.
 * Formato: ORD-20250101-ABC123
 */
export const generateOrderCode = (): string => {
  const fecha = new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");

  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `ORD-${fecha}-${random}`;
};
