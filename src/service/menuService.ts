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
  id: string; // Maps to codigoProducto (e.g., TC001)
  dbId?: number; // Maps to backend PK (e.g., 1)
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

export interface Categoria {
  id: number;
  nombre: string;
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
      console.log("[DEBUG] Categories fetched:", categories);

      const allProducts: Producto[] = categories.flatMap((cat) => {
        if (!cat.productos) {
             console.warn(`[DEBUG] Category ${cat.nombre} has no products array`, cat);
             return [];
        }
        console.log(`[DEBUG] Processing category ${cat.nombre}, products: ${cat.productos.length}`);
        
        return cat.productos.map((p: any) => {
          const slug = toSlug(p.nombre);
          const imagenPrincipal = formatImagePath(p.imagenPrincipal);
          const imagenesDetalle = mergeDetailImages(slug, p.imagenesDetalle);

          return {
            id: p.codigoProducto || p.id.toString(), // Prefer code, fallback to ID if missing
            dbId: p.id,
            nombre: p.nombre,
            descripcion: p.descripcion,
            precio: p.precio,
            imagen: imagenPrincipal || FALLBACK_IMAGE,
            imagenes_detalle: imagenesDetalle,
            categoria: cat.nombre,
            stock: p.stock,
            stock_critico: p.stockCritico,
            activo: p.activo ?? true, // Default to true if missing temporarily
          };
        });
      });
      console.log("[DEBUG] Total mapped products:", allProducts);
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

  async getCategories(): Promise<Categoria[]> {
    try {
      const { data } = await apiClient.get<any[]>("/categorias");
      return data.map((c) => ({
        id: c.id,
        nombre: c.nombre
      }));
    } catch (error) {
     console.error("Error fetching categories:", error);
     return [];
    }
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
    try {
      // 1. Obtener categorías para mapear nombre -> ID
      const { data: categories } = await apiClient.get<any[]>("/categorias");
      const catObj = categories.find((c) => c.nombre === producto.categoria);

      if (!catObj) {
        throw new Error(`Categoría no encontrada: ${producto.categoria}`);
      }

      // 2. Construir payload para backend
      const payload = {
        codigoProducto: producto.id, // Frontend usa id como código
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        imagenPrincipal: producto.imagen,
        imagenesDetalle: JSON.stringify(producto.imagenes_detalle),
        stock: producto.stock,
        stockCritico: producto.stock_critico,
        categoria: { id: catObj.id }, // Backend espera objeto con ID
      };

      await apiClient.post("/productos", payload);
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  async update(id: string, data: Producto): Promise<void> {
    try {
      // Necesitamos el ID numérico del backend.
      // Si el producto viene con dbId, lo usamos. Si no, intentamos buscarlo.
      let numericId = data.dbId;

      if (!numericId) {
        // Fallback: buscar por código (id actual del frontend)
        // Esto asume que el backend tiene un endpoint de búsqueda o iteramos (ineficiente pero funcional por ahora)
        // O mejor, asumimos que getAll ya populó dbId.
        const all = await this.getAll();
        const found = all.find((p) => p.id === id);
        if (found && found.dbId) {
          numericId = found.dbId;
        }
      }

      console.log(`[DEBUG] Update product ${id}, resolved numericId: ${numericId}`);

      if (!numericId) {
        throw new Error("No se pudo determinar el ID interno del producto para actualizar");
      }

      // 1. Obtener categorías para mapear nombre -> ID
      const { data: categories } = await apiClient.get<any[]>("/categorias");
      const catObj = categories.find((c) => c.nombre === data.categoria);

      if (!catObj) {
        throw new Error(`Categoría no encontrada: ${data.categoria}`);
      }

      const payload = {
        codigoProducto: data.id,
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: data.precio,
        imagenPrincipal: data.imagen,
        imagenesDetalle: JSON.stringify(data.imagenes_detalle),
        stock: data.stock,
        stockCritico: data.stock_critico,
        categoria: { id: catObj.id },
        activo: data.activo,
      };
      
      console.log(`[DEBUG] Sending payload to PUT /productos/${numericId}:`, payload);

      await apiClient.put(`/productos/${numericId}`, payload);
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  async setStatus(id: string, activo: boolean): Promise<void> {
     try {
       console.log(`[DEBUG] setStatus called for id: ${id}, activo: ${activo}`);
       const all = await this.getAll();
       const product = all.find((p) => p.id === id);
       
       if (!product) {
         console.error(`[DEBUG] Product not found in getAll for id: ${id}`);
         throw new Error(`Producto no encontrado para cambio de estado: ${id}`);
       }

       console.log(`[DEBUG] Found product to update:`, product);
       const updatedProduct = { ...product, activo };
       await this.update(id, updatedProduct);
     } catch (error) {
       console.error("Error setting status:", error);
       throw error;
     }
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
