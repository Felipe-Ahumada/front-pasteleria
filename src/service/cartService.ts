import apiClient from "@/config/axiosConfig";
import type { CartItem } from "@/context/cart/CartContext";
import { formatImagePath } from "@/utils/storage/imageHelpers";

export interface BackendCartItem {
  id: number;
  product: {
    id: string;
    nombre: string;
    precio: number;
    imagenPrincipal: string;
    stock: number;
    activo: boolean;
  };
  quantity: number;
  message: string;
}

export interface BackendCart {
  id: number;
  items: BackendCartItem[];
}

export const cartService = {
  async getCart(): Promise<CartItem[]> {
    const { data } = await apiClient.get<BackendCart>("/cart");
    return this.mapBackendCartToCartItems(data);
  },

  async addItem(productId: string, quantity: number, message?: string): Promise<CartItem[]> {
    const { data } = await apiClient.post<BackendCart>("/cart/items", {
      productId,
      quantity,
      message,
    });
    return this.mapBackendCartToCartItems(data);
  },

  async updateItem(itemId: number, quantity: number): Promise<CartItem[]> {
    const { data } = await apiClient.put<BackendCart>(`/cart/items/${itemId}`, {
      quantity,
    });
    return this.mapBackendCartToCartItems(data);
  },

  async removeItem(itemId: number): Promise<CartItem[]> {
    const { data } = await apiClient.delete<BackendCart>(`/cart/items/${itemId}`);
    return this.mapBackendCartToCartItems(data);
  },

  async clearCart(): Promise<void> {
    await apiClient.delete("/cart");
  },

  // Helper to map backend response back to frontend CartItem format
  mapBackendCartToCartItems(backendCart: BackendCart): CartItem[] {
    return backendCart.items.map((item) => ({
      codigo: item.product.id,
      nombre: item.product.nombre,
      precio: item.product.precio,
      cantidad: item.quantity,
      imagen: formatImagePath(item.product.imagenPrincipal),
      mensaje: item.message,
      stock: item.product.stock,
      backendId: item.id,
    }));
  },
};
