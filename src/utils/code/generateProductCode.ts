import { menuService } from "@/service/menuService";

/**
 * STOP WORDS → palabras que no aportan significado al prefijo.
 * Así: "Productos sin Gluten" → PG
 */
const STOP_WORDS = ["sin", "de", "del", "la", "el", "los", "las"];

/**
 * Convierte una categoría en un prefijo de dos letras.
 * EJEMPLOS:
 * - "Tortas Cuadradas" → TC
 * - "Productos sin Gluten" → PG
 * - "Panadería Gourmet" → PG
 * - "General" → GE
 * - "Sin Azúcar" → SA
 */
export const getCategoryPrefix = (categoria: string): string => {
  const words = categoria
    .trim()
    .split(/\s+/)
    .filter((w) => !STOP_WORDS.includes(w.toLowerCase()));

  if (words.length === 0) return "XX"; // fallback improbable

  // Si queda solo una palabra → primeras 2 letras
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  // Dos primeras palabras significativas → dos iniciales
  return (words[0][0] + words[1][0]).toUpperCase();
};

/**
 * Genera un código único dentro del sistema.
 * EJEMPLOS:
 * TC001, TC002, …
 * PG001, PG002, …
 */
export const generateProductCode = (categoria: string): string => {
  const prefix = getCategoryPrefix(categoria);
  const productos = menuService.getCached();

  const existentes = productos
    .filter((p) => p.id.startsWith(prefix))
    .map((p) => p.id);

  if (existentes.length === 0) {
    return prefix + "001";
  }

  const lastNumber = existentes
    .map((id) => Number(id.slice(prefix.length)))
    .filter((n) => !isNaN(n))
    .sort((a, b) => b - a)[0];

  const next = (lastNumber + 1).toString().padStart(3, "0");

  return prefix + next;
};
