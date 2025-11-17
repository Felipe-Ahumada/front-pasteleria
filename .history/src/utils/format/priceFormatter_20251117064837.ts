// utils/format/priceFormatter.ts

/**
 * Formatea precios en pesos chilenos (CLP)
 * sin decimales y con separación de miles.
 * Acepta valores nullish y retorna $0 en caso de recibir algo inválido.
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
