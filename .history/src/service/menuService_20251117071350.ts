import menuData from "@/data/menu_datos.json";
import {
  detailImageMap,
  fallbackProductImage,
  formatImagePath,
  toSlug,
} from "@/utils/storage/imageHelpers";

/* ===========================================================
   TIPOS BASE DEL JSON
=========================================================== */
export interface ProductoJSON {
  codigo_producto: string;
  nombre_producto: string;
  precio_producto: number;
  descripción_producto: string;
  imagen_producto: string;
  imagenes_detalle?: string[];
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

/* ===========================================================
   TIPO NORMALIZADO (DOMINIO)
=========================================================== */
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
const FALLBACK_IMAGE = fallbackProductImage;

const mergeDetailImages = (
  slug: string,
  raw?: string[]
): string[] => {
  const fromJson = (raw ?? []).map(formatImagePath).filter(Boolean);
  const fromAssets = detailImageMap[slug] ?? [];

  const combined = [...fromJson, ...fromAssets];
  const unique = Array.from(new Set(combined.filter(Boolean)));

  return unique;
};

/* ===========================================================
   NORMALIZACIÓN JSON PRODUCTOS
=========================================================== */
const mapJsonToProductos = (data: MenuJSON): Producto[] => {
  const result: Producto[] = [];

  for (const categoria of data.categorias) {
    for (const p of categoria.productos) {
      const slug = toSlug(p.nombre_producto);
      const imagenPrincipal = formatImagePath(p.imagen_producto);
      const imagenesDetalle = mergeDetailImages(slug, p.imagenes_detalle);

      result.push({
        id: p.codigo_producto,
        nombre: p.nombre_producto,
        descripcion: p.descripción_producto,
        precio: p.precio_producto,
        imagen: imagenPrincipal || FALLBACK_IMAGE,
        imagenes_detalle: imagenesDetalle,
        categoria: categoria.nombre_categoria,
        stock: p.stock,
        stock_critico: p.stock_critico,
      });
    }
  }

  return result;
};

/* ===========================================================
   CACHE LOCAL
=========================================================== */
const CACHE_KEY = "menu_cache_v1";

const saveCache = (productos: Producto[]) =>
  localStorage.setItem(CACHE_KEY, JSON.stringify(productos));

const loadCache = (): Producto[] | null => {
  const raw = localStorage.getItem(CACHE_KEY);
  return raw ? (JSON.parse(raw) as Producto[]) : null;
};

/* ===========================================================
   SERVICE FINAL
=========================================================== */
export const menuService = {
  getAll(): Producto[] {
    const productos = mapJsonToProductos(menuData as MenuJSON);
    saveCache(productos);
    return productos;
  },

  getCached(): Producto[] {
    const cached = loadCache();
    if (cached) return cached;

    const productos = mapJsonToProductos(menuData as MenuJSON);
    saveCache(productos);
    return productos;
  },

  getById(id: string): Producto | undefined {
    const productos = this.getCached();
    return productos.find((p) => p.id === id);
  },

  create(producto: Producto): void {
    const productos = this.getCached();
    if (productos.some((p) => p.id === producto.id))
      throw new Error("Ya existe un producto con este ID");

    const nuevos = [...productos, producto];
    saveCache(nuevos);
  },

  update(id: string, data: Producto): void {
    const productos = this.getCached();
    const index = productos.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Producto no encontrado");

    productos[index] = { ...data };
    saveCache(productos);
  },

  delete(id: string): void {
    const productos = this.getCached();
    const nuevos = productos.filter((p) => p.id !== id);
    saveCache(nuevos);
  },

  clearCache() {
    localStorage.removeItem(CACHE_KEY);
  },
};

export type MenuService = typeof menuService;
