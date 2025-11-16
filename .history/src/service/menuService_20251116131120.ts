import menuData from "@/data/menu_datos.json";

/* ===========================================================
   TIPOS BASE DEL JSON
=========================================================== */
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

/* ===========================================================
   MAPEO DE IMÁGENES LOCALES
=========================================================== */
const MAIN_IMAGES = import.meta.glob("/src/assets/images/catalog/*", {
  import: "default",
  eager: true,
}) as Record<string, string>;

const DETAIL_IMAGES = import.meta.glob("/src/assets/images/catalog_detail/*", {
  import: "default",
  eager: true,
}) as Record<string, string>;

/* -----------------------------------------------------------
   image: "img/catalogo/torta_x.jpg" → "torta_x.jpg"
----------------------------------------------------------- */
const resolveMainImage = (relative: string): string => {
  const clean = relative.replace("img/catalogo/", ""); // FIX CLAVE

  const match = Object.entries(MAIN_IMAGES).find(([path]) =>
    path.endsWith(clean)
  );

  return (
    match?.[1] ??
    new URL("/src/assets/images/generica.png", import.meta.url).href
  );
};

/* -----------------------------------------------------------
   Construir mapa de imágenes de detalle agrupadas
----------------------------------------------------------- */
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

/* Utilidad para normalizar nombres */
const toSlug = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

/* ===========================================================
   NORMALIZACIÓN JSON → PRODUCTOS
=========================================================== */
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

        // ← FIX: mapeo correcto de imágenes locales
        imagen: resolveMainImage(p.imagen_producto),

        imagenes_detalle: DETAIL_MAP[slug] ?? [],
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
