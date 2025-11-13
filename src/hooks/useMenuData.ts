import { useMemo } from "react";
import menuData from "@/data/menu_datos.json";

const catalogImages = import.meta.glob("@/assets/images/catalog/**/*", {
  import: "default",
  eager: true,
}) as Record<string, string>;

const catalogImageMap = Object.entries(catalogImages).reduce<Record<string, string>>(
  (acc, [path, src]) => {
    const key = path.split("/").pop();
    if (key) acc[key] = src;
    return acc;
  },
  {}
);

export const formatImagePath = (relativePath: string) => {
  const fileName = relativePath.split("/").pop();
  if (fileName && catalogImageMap[fileName]) {
    return catalogImageMap[fileName];
  }
  const normalized = relativePath
    .replace(/^img\//, "images/")
    .replace("catalogo", "catalog");
  return new URL(`@/assets/${normalized}`, import.meta.url).href;
};

export const useMenuData = () => {
  /** Productos enriquecidos como antes */
  const allProducts = useMemo(() => {
    return menuData.categorias.flatMap((categoria) =>
      categoria.productos.map((producto) => ({
        ...producto,
        categoriaId: categoria.id_categoria,
        categoriaNombre: categoria.nombre_categoria,
      }))
    );
  }, []);

  /** Lista de categorías */
  const categories = menuData.categorias;

  return { allProducts, categories };
};
