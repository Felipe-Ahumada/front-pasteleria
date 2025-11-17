// utils/format/priceFormatter.ts

/**
 * Formatea precios en pesos chilenos (CLP)
 */
export const formatPrice = (value?: number | null): string => {
  const normalized = Number(value);
  const safeValue = Number.isFinite(normalized) ? normalized : 0;

  return safeValue.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });
};
