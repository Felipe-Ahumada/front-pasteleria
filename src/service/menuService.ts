import apiClient from "@/config/axiosConfig";
import {
  detailImageMap,
  fallbackProductImage,
  formatImagePath,
  toSlug,
} from "@/utils/storage/imageHelpers";

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

const mergeDetailImages = (
  slug: string,
  raw?: string[] | string // Backend might send JSON string or array
): string[] => {
  let parsedRaw: string[] = [];
  if (typeof raw === "string") {
    try {
      parsedRaw = JSON.parse(raw);
    } catch {
      parsedRaw = [];
    }
  } else if (Array.isArray(raw)) {
    parsedRaw = raw;
  }

  const fromJson = (parsedRaw ?? []).map(formatImagePath).filter(Boolean);
  const fromAssets = detailImageMap[slug] ?? [];

  const combined = [...fromJson, ...fromAssets];
  const unique = Array.from(new Set(combined.filter(Boolean)));

  return unique;
};

/* ===========================================================
   SERVICE
=========================================================== */
export const menuService = {
  async getAll(): Promise<Producto[]> {
    try {
      // Fetch categories to get products with their category name
      const { data: categories } = await apiClient.get<any[]>("/categorias");

      const allProducts: Producto[] = categories.flatMap((cat) =>
        cat.productos.map((p: any) => {
          const slug = toSlug(p.nombre);
          const imagenPrincipal = formatImagePath(p.imagenPrincipal);
          const imagenesDetalle = mergeDetailImages(slug, p.imagenesDetalle);

          return {
            id: p.id.toString(),
            nombre: p.nombre,
            descripcion: p.descripcion,
            precio: p.precio,
            imagen: imagenPrincipal || FALLBACK_IMAGE,
            imagenes_detalle: imagenesDetalle,
            categoria: cat.nombre,
            stock: p.stock,
            stock_critico: p.stockCritico,
            activo: true, // Backend doesn't seem to have 'activo' flag exposed yet, assume true
          };
        })
      );
      return allProducts;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  // Deprecated: Alias to getAll for backward compatibility during refactor
  // but now returns Promise, so calling code MUST await.
  async getCached(): Promise<Producto[]> {
    return this.getAll();
  },

  async getActive(): Promise<Producto[]> {
    const products = await this.getAll();
    return products.filter((p) => p.activo !== false);
  },

  async getById(id: string): Promise<Producto | undefined> {
    try {
      // Try fetching specific product.
      // Note: Backend /productos/{id} response might not include category name if JsonBackReference is used.
      // So we might need to fetch all or adjust backend.
      // For now, fetching all is safer to get category name.
      const products = await this.getAll();
      return products.find((p) => p.id === id);
    } catch (error) {
      console.error("Error fetching product by id:", error);
      return undefined;
    }
  },

  async getActiveById(id: string): Promise<Producto | undefined> {
    const products = await this.getActive();
    return products.find((p) => p.id === id);
  },

  async create(producto: Producto): Promise<void> {
    // This would require mapping frontend Producto to backend structure
    // and calling POST /productos.
    // For now, leaving as placeholder or implementing if needed for Admin.
    console.warn(
      "create product not fully implemented in frontend service yet"
    );
  },

  async update(id: string, data: Producto): Promise<void> {
    // Placeholder
    console.warn(
      "update product not fully implemented in frontend service yet"
    );
  },

  async setStatus(id: string, activo: boolean): Promise<void> {
    // Placeholder
  },

  async block(id: string): Promise<void> {
    await this.setStatus(id, false);
  },

  async unblock(id: string): Promise<void> {
    await this.setStatus(id, true);
  },

  async delete(id: string): Promise<void> {
    await this.block(id);
  },

  clearCache() {
    // No-op
  },

  async consumeStock(orderItems: Array<{ codigo: string; cantidad: number }>) {
    // Stock deduction is now handled by the backend when creating the order.
    // We don't need to do anything here.
    console.log("Stock deduction handled by backend.");
  },
};

export type MenuService = typeof menuService;
