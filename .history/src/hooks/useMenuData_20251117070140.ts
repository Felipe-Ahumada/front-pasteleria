import { useMemo } from "react";
import menuData from "@/data/menu_datos.json";

export const useMenuData = () => {
  // Productos enriquecidos como antes 
  const allProducts = useMemo(() => {
    return menuData.categorias.flatMap((categoria) =>
      categoria.productos.map((producto) => ({
        ...producto,
        categoriaId: categoria.id_categoria,
        categoriaNombre: categoria.nombre_categoria,
      }))
    );
  }, []);

  // Lista de categorías
  const categories = menuData.categorias;

  return { allProducts, categories };
};
