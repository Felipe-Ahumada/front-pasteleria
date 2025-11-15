// service/menuService.ts
import menuData from "@/data/menu_datos.json";

/* ===========================================================
   TIPOS BASE (JSON ORIGINAL)
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
   IMÁGENES PRE-CARGADAS
=========================================================== */
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
    path.endsWith(file)
  );
  return match
    ? match[1]
    : new URL("/src/assets/images/generica.png", import.meta.url).href;
};

/* ===========================================================
   MAPA DE IMÁGENES DE DETALLE (agrupadas por slug)
=========================================================== */
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

/* ===========================================================
   JSON → NORMALIZACIÓN
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

/* ===========================================================
   LOCAL STORAGE (CACHE)
=========================================================== */
const CACHE_KEY = "menu_cache_v1";

const saveCache = (productos: Producto[]) =>
  localStorage.setItem(CACHE_KEY, JSON.stringify(productos));

const loadCache = (): Producto[] | null => {
  const raw = localStorage.getItem(CACHE_KEY);
  return raw ? (JSON.parse(raw) as Producto[]) : null;
};

/* ===========================================================
   SERVICE FINAL — CRUD COMPLETO
=========================================================== */
export const menuService = {
  /* ------------------------------
     GET ALL (recarga JSON completo)
  ------------------------------- */
  async getAll(): Promise<Producto[]> {
    const productos = mapJsonToProductos(menuData as MenuJSON);
    saveCache(productos);
    return productos;
  },

  /* ------------------------------
     GET CACHED (rápido)
  ------------------------------- */
  getCached(): Producto[] {
    const cached = loadCache();
    if (cached) return cached;

    const productos = mapJsonToProductos(menuData as MenuJSON);
    saveCache(productos);
    return productos;
  },

  /* ------------------------------
     GET BY ID
  ------------------------------- */
  async getById(id: string): Promise<Producto | undefined> {
    const productos = this.getCached();
    return productos.find((p) => p.id === id);
  },

  /* ------------------------------
     CREATE (Producto)
  ------------------------------- */
  create(producto: Producto): void {
    const productos = this.getCached();

    if (productos.some((p) => p.id === producto.id)) {
      throw new Error("Ya existe un producto con este ID");
    }

    const nuevos = [...productos, producto];
    saveCache(nuevos);
  },

  /* ------------------------------
     UPDATE (ID, DATA)
  ------------------------------- */
  update(id: string, data: Producto): void {
    const productos = this.getCached();

    const index = productos.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Producto no encontrado");

    productos[index] = { ...data };
    saveCache(productos);
  },

  /* ------------------------------
     DELETE (ID)
  ------------------------------- */
  delete(id: string): void {
    const productos = this.getCached();

    const nuevos = productos.filter((p) => p.id !== id);
    saveCache(nuevos);
  },

  /* ------------------------------
     CLEAR CACHE
  ------------------------------- */
  clearCache() {
    localStorage.removeItem(CACHE_KEY);
  },
};

export type MenuService = typeof menuService;
