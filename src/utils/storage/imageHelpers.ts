/**
 * UTILIDADES DE IMÁGENES
 * ======================
 * Funciona con:
 *  - assets/images/catalog
 *  - assets/images/catalog_detail
 *  - rutas JSON "img/catalogo/archivo.jpg"
 */

//
// 1. SLUG NORMALIZADO
//
export const toSlug = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar tildes
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_") // espacios y símbolos → _
    .replace(/^_+|_+$/g, ""); // limpiar extremos

//
// 2. CARGA DE IMÁGENES DEL CATÁLOGO PRINCIPAL
//
const catalogImages = import.meta.glob(
  "/src/assets/images/catalog/**/*",
  {
    import: "default",
    eager: true,
  }
) as Record<string, string>;

// Mapa: nombre_de_archivo → url_importada
export const catalogImageMap = Object.entries(catalogImages).reduce<
  Record<string, string>
>((acc, [path, src]) => {
  const file = path.split("/").pop();
  if (file) acc[file] = src;
  return acc;
}, {});

//
// 3. CARGA DE IMÁGENES DE DETALLE (3 fotos por producto)
//
const detailImages = import.meta.glob(
  "/src/assets/images/catalog_detail/**/*",
  {
    import: "default",
    eager: true,
  }
) as Record<string, string>;

// Mapa: slug_del_producto → lista_de_urls
export const detailImageMap = Object.entries(detailImages).reduce<
  Record<string, string[]>
>((acc, [path, src]) => {
  const file = path.split("/").pop();
  if (!file) return acc;

  const base = file.replace(/\.[^.]+$/, ""); // quitar extensión
  const slug = base.replace(/_\d+$/, ""); // remover "_1", "_2", "_3"

  if (!acc[slug]) acc[slug] = [];
  acc[slug].push(src);

  return acc;
}, {});

//
// 4. NORMALIZADOR DE RUTAS PRINCIPALES
//    JSON trae rutas tipo: img/catalogo/torta.jpg
//
export const formatImagePath = (rawPath: string): string => {
  if (!rawPath) {
    return new URL("/src/assets/images/generica.png", import.meta.url).href;
  }

  // Extraer archivo final
  const file = rawPath.split("/").pop();
  if (!file) {
    return new URL("/src/assets/images/generica.png", import.meta.url).href;
  }

  // Ver si existe en catálogo real
  if (catalogImageMap[file]) {
    return catalogImageMap[file];
  }

  // Intento secundario: convertir old → new
  const normalized = rawPath
    .replace(/^img\//, "images/") // img/ → images/
    .replace("catalogo", "catalog"); // catalogo → catalog

  try {
    return new URL(`/src/assets/${normalized}`, import.meta.url).href;
  } catch {
    return new URL("/src/assets/images/generica.png", import.meta.url).href;
  }
};
