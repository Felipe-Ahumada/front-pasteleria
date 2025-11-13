// utils/format/priceFormatter.ts

/**
 * Formatea precios en pesos chilenos (CLP)
 * sin decimales y con separación de miles.
 */
export const formatPrice = (value: number): string => {
  return value.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });
};
