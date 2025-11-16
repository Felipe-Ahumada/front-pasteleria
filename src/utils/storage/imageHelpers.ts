import { defaultProductImage } from "@/assets";

/**
 * UTILIDADES DE IMÁGENES
 * ======================
 * Funciona con:
 *  - assets/images/catalog
 *  - assets/images/catalog_detail
 *  - rutas JSON "img/catalogo/archivo.jpg"
 */

const REMOTE_IMAGE_PATTERN = /^https?:\/\//i;
const FALLBACK_IMAGE = defaultProductImage;

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

const resolveCatalogImage = (fileName?: string | null) => {
  if (!fileName) return null;
  return catalogImageMap[fileName] ?? null;
};

const normalizeRelativePath = (value: string) =>
  value
    .replace(/^\s+|\s+$/g, "")
    .replace(/^@?\//, "")
    .replace(/^(\.\/)+/, "")
    .replace(/^img\//i, "images/")
    .replace(/catalogo/gi, "catalog");

//
// 4. NORMALIZADOR DE RUTAS PRINCIPALES
//    Acepta rutas absolutas remotas o relativas locales
//
export const formatImagePath = (rawPath: string): string => {
  if (!rawPath) return FALLBACK_IMAGE;

  const trimmed = rawPath.trim();

  if (REMOTE_IMAGE_PATTERN.test(trimmed)) {
    return trimmed;
  }

  const directFile = trimmed.split("/").pop();
  const directMatch = resolveCatalogImage(directFile);
  if (directMatch) {
    return directMatch;
  }

  const normalizedPath = normalizeRelativePath(trimmed);
  const normalizedFile = normalizedPath.split("/").pop();
  const normalizedMatch = resolveCatalogImage(normalizedFile);
  if (normalizedMatch) {
    return normalizedMatch;
  }

  return FALLBACK_IMAGE;
};

export const fallbackProductImage = FALLBACK_IMAGE;
