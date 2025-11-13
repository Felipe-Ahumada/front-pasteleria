// service/menuService.ts
import menuData from "@/data/menu_datos.json";

/** --------------------------
 * Tipos base (API o JSON)
 * ------------------------- */
export interface ProductoJSON {
  codigo_producto: string;
  nombre_producto: string;
  precio_producto: number;
  descripción_producto: string;
  imagen_producto: string;
  stock: number;
  stock_critico: number;
}

export interface CategoriaJSON {
  id_categoria: number;
  nombre_categoria: string;
  productos: ProductoJSON[];
}

export interface MenuJSON {
  nombre_pasteleria: string;
  categorias: CategoriaJSON[];
}

/** --------------------------
 * Tipo de dominio (normalizado)
 * ------------------------- */
export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  imagenes_detalle: string[];
  categoria: string;
  stock: number;
  stock_critico?: number;
}

/** --------------------------
 * Cache
 * ------------------------- */
const CACHE_KEY = "menu_cache_v1";

/** Preload imágenes */
const MAIN_IMAGES = import.meta.glob("/src/assets/images/catalog/*", {
  import: "default",
  eager: true,
}) as Record<string, string>;

const DETAIL_IMAGES = import.meta.glob("/src/assets/images/catalog_detail/*", {
  import: "default",
  eager: true,
}) as Record<string, string>;

const normalizeMainImage = (relative: string): string => {
  const file = relative.split("/").pop() ?? "";
  const match = Object.entries(MAIN_IMAGES).find(([path]) =>
    path.endsWith(file),
  );
  return match ? match[1] : new URL("/src/assets/images/generica.png", import.meta.url).href;
};

/** Mapea archivos de detalle agrupados por slug */
const buildDetailMap = (): Record<string, string[]> => {
  const map: Record<string, string[]> = {};

  for (const [path, src] of Object.entries(DETAIL_IMAGES)) {
    const file = path.split("/").pop() ?? "";
    const base = file.replace(/\.[^/.]+$/, "");
    const slug = base.replace(/_\d+$/, "");

    if (!map[slug]) map[slug] = [];
    map[slug].push(src);
  }

  return map;
};

const DETAIL_MAP = buildDetailMap();

const toSlug = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

/** --------------------------
 * JSON → dominio
 * ------------------------- */
const mapJsonToProductos = (data: MenuJSON): Producto[] => {
  const result: Producto[] = [];

  for (const categoria of data.categorias) {
    for (const p of categoria.productos) {
      const slug = toSlug(p.nombre_producto);
      result.push({
        id: p.codigo_producto,
        nombre: p.nombre_producto,
        descripcion: p.descripción_producto,
        precio: p.precio_producto,
        imagen: normalizeMainImage(p.imagen_producto),
        imagenes_detalle: DETAIL_MAP[slug] ?? [],
        categoria: categoria.nombre_categoria,
        stock: p.stock,
        stock_critico: p.stock_critico,
      });
    }
  }

  return result;
};

/** --------------------------
 * Local cache helpers
 * ------------------------- */
const saveCache = (productos: Producto[]) =>
  localStorage.setItem(CACHE_KEY, JSON.stringify(productos));

const loadCache = (): Producto[] | null => {
  const raw = localStorage.getItem(CACHE_KEY);
  return raw ? (JSON.parse(raw) as Producto[]) : null;
};

/** --------------------------
 * SERVICE FINAL
 * ------------------------- */
export const menuService = {
  /** FUTURO backend (ahora JSON local) */
  async getAll(): Promise<Producto[]> {
    const productos = mapJsonToProductos(menuData as MenuJSON);
    saveCache(productos);
    return productos;
  },

  /** Sync inmediato */
  getCached(): Producto[] {
    const cached = loadCache();
    if (cached) return cached;

    const productos = mapJsonToProductos(menuData as MenuJSON);
    saveCache(productos);
    return productos;
  },

  /** Buscar por ID */
  async getById(id: string): Promise<Producto | undefined> {
    const productos = this.getCached();
    return productos.find((p) => p.id === id);
  },

  clearCache() {
    localStorage.removeItem(CACHE_KEY);
  },
};

export type MenuService = typeof menuService;
