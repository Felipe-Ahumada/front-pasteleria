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
  activo: boolean;
}
const FALLBACK_IMAGE = fallbackProductImage;

type ProductoCache = Omit<Producto, "activo"> & {
  activo?: boolean;
  imagenes_detalle?: string[];
};

export const MENU_CACHE_UPDATED_EVENT = "menu:cache-updated";

const notifyCacheUpdate = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(MENU_CACHE_UPDATED_EVENT));
  }
};

<<<<<<< HEAD
=======
const groupQuantities = (
  items: Array<{ codigo: string; cantidad: number }>
): Map<string, number> => {
  const grouped = new Map<string, number>();

  items.forEach(({ codigo, cantidad }) => {
    const normalizedCode = codigo.trim();
    if (!normalizedCode) return;

    const safeQty = Number.isFinite(cantidad) ? Math.max(0, cantidad) : 0;
    if (safeQty <= 0) return;

    const prev = grouped.get(normalizedCode) ?? 0;
    grouped.set(normalizedCode, prev + safeQty);
  });

  return grouped;
};

>>>>>>> main
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
        activo: true,
      });
    }
  }

  return result;
};

/* ===========================================================
   CACHE LOCAL
=========================================================== */
const CACHE_KEY = "menu_cache_v1";

const normalizeProductos = (productos: ProductoCache[]): Producto[] =>
  productos.map((p) => ({
    ...p,
    imagenes_detalle: Array.isArray(p.imagenes_detalle)
      ? p.imagenes_detalle
      : [],
    activo: p.activo ?? true,
  }));

const saveCache = (productos: Producto[]) => {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify(normalizeProductos(productos))
  );
  notifyCacheUpdate();
};

const loadCache = (): Producto[] | null => {
  const raw = localStorage.getItem(CACHE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as ProductoCache[];
    return normalizeProductos(parsed);
  } catch {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
};

/* ===========================================================
   SERVICE
=========================================================== */
export const menuService = {
  getAll(): Producto[] {
    return this.getCached();
  },

  getCached(): Producto[] {
    const cached = loadCache();
    if (cached) return cached;

    const productos = mapJsonToProductos(menuData as MenuJSON);
    saveCache(productos);
    return productos;
  },

  getActive(): Producto[] {
    return this.getCached().filter((p) => p.activo !== false);
  },

  getById(id: string): Producto | undefined {
    const productos = this.getCached();
    return productos.find((p) => p.id === id);
  },

  getActiveById(id: string): Producto | undefined {
    return this.getActive().find((p) => p.id === id);
  },

  create(producto: Producto): void {
    const productos = this.getCached();
    if (productos.some((p) => p.id === producto.id))
      throw new Error("Ya existe un producto con este ID");

    const nuevo: Producto = {
      ...producto,
      activo: producto.activo ?? true,
      imagenes_detalle: producto.imagenes_detalle ?? [],
    };

    const nuevos = [...productos, nuevo];
    saveCache(nuevos);
  },

  update(id: string, data: Producto): void {
    const productos = this.getCached();
    const index = productos.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Producto no encontrado");

    productos[index] = {
      ...data,
      activo: data.activo ?? productos[index].activo ?? true,
      imagenes_detalle: data.imagenes_detalle ?? [],
    };
    saveCache(productos);
  },

  setStatus(id: string, activo: boolean): void {
    const productos = this.getCached();
    const index = productos.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Producto no encontrado");

    productos[index] = {
      ...productos[index],
      activo,
    };

    saveCache(productos);
  },

  block(id: string): void {
    this.setStatus(id, false);
  },

  unblock(id: string): void {
    this.setStatus(id, true);
  },

  delete(id: string): void {
    // Compatibilidad retro: el "delete" ahora actúa como bloqueo.
    this.block(id);
  },

  clearCache() {
    localStorage.removeItem(CACHE_KEY);
    notifyCacheUpdate();
<<<<<<< HEAD
=======
  },

  consumeStock(orderItems: Array<{ codigo: string; cantidad: number }>) {
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return;
    }

    const byProduct = groupQuantities(orderItems);
    if (byProduct.size === 0) return;

    const productos = this.getCached();
    let hasChanges = false;

    const updated = productos.map((producto) => {
      const qty = byProduct.get(producto.id);
      if (!qty) return producto;

      const nextStock = Math.max(0, producto.stock - qty);
      if (nextStock === producto.stock) return producto;

      hasChanges = true;
      return {
        ...producto,
        stock: nextStock,
      };
    });

    if (hasChanges) {
      saveCache(updated);
    }
>>>>>>> main
  },
};

export type MenuService = typeof menuService;
