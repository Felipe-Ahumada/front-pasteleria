import menuData from "@/data/menu_datos.json";
import type { MenuJSON } from "@/service/menuService";

/**
 * Extrae dinámicamente todas las categorías del JSON.
 */
export const getUniqueCategories = (): string[] => {
  const data = menuData as MenuJSON;

  const categories = data.categorias.map((c) => c.nombre_categoria);

  // Únicas + alfabeticamente ordenadas
  return Array.from(new Set(categories)).sort((a, b) =>
    a.localeCompare(b, "es")
  );
};

/** 
 * Export para uso directo en selects sin llamar funciones
 */
export const CATEGORIAS: string[] = getUniqueCategories();
