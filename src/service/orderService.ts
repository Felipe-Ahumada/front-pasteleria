import apiClient from "@/config/axiosConfig";
import type { Order, OrderStatus } from "@/types/order";
import {
  formatImagePath,
  fallbackProductImage,
} from "@/utils/storage/imageHelpers";
import { menuService, type Producto } from "./menuService";

export const orderService = {
  async getAll(): Promise<Order[]> {
    try {
      const [ordersResponse, products] = await Promise.all([
        apiClient.get<any[]>("/pedidos"),
        menuService.getAll(),
      ]);

      const productMap = new Map(products.map((p) => [p.id, p]));
      const productNameMap = new Map(
        products.map((p) => [p.nombre.toLowerCase(), p])
      );

      return ordersResponse.data.map((order) =>
        mapBackendToFrontend(order, productMap, productNameMap)
      );
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  },

  async create(order: Order): Promise<Order> {
    const backendOrder = mapFrontendToBackend(order);
    const [response, products] = await Promise.all([
      apiClient.post<any>("/pedidos", backendOrder),
      menuService.getAll(),
    ]);

    const productMap = new Map(products.map((p) => [p.id, p]));
    const productNameMap = new Map(
      products.map((p) => [p.nombre.toLowerCase(), p])
    );

    return mapBackendToFrontend(response.data, productMap, productNameMap);
  },

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    // Note: Backend endpoint is PUT /pedidos/{id}/estado
    // It expects a raw string body for the status, or maybe JSON depending on implementation.
    // Based on PedidoController: @RequestBody String estado
    const [response, products] = await Promise.all([
      apiClient.put<any>(`/pedidos/${id}/estado`, status.toUpperCase(), {
        headers: { "Content-Type": "text/plain" },
      }),
      menuService.getAll(),
    ]);

    const productMap = new Map(products.map((p) => [p.id, p]));
    const productNameMap = new Map(
      products.map((p) => [p.nombre.toLowerCase(), p])
    );

    return mapBackendToFrontend(response.data, productMap, productNameMap);
  },
};

// Mappers
const mapBackendToFrontend = (
  backendOrder: any,
  productMap?: Map<string, Producto>,
  productNameMap?: Map<string, Producto>
): Order => {
  console.log("Mapping Order:", backendOrder.id, "Items:", backendOrder.items);
  return {
    id: backendOrder.id.toString(),
    userId: backendOrder.userId.toString(),
    items: backendOrder.items.map((i: any) => {
      const productId = i.productoId.toString();
      const productName = i.productoNombre;

      // Try lookup by ID first, then by Name (case-insensitive)
      const product =
        productMap?.get(productId) ||
        productNameMap?.get(productName.toLowerCase());

      // Priority:
      // 1. Image from matched product (ID or Name)
      // 2. Image from nested product object
      // 3. Fallback
      const imagen =
        product?.imagen ||
        (i.producto?.imagenPrincipal
          ? formatImagePath(i.producto.imagenPrincipal)
          : fallbackProductImage);

      return {
        codigo: productId !== "0" ? productId : product?.id || "0",
        nombre: i.productoNombre,
        precio: i.precioUnitario,
        cantidad: i.cantidad,
        imagen: imagen,
        mensaje: i.mensaje,
      };
    }),
    fechaPedido: backendOrder.fecha,
    fechaEntrega: backendOrder.fechaEntrega,
    total: backendOrder.total,
    status: backendOrder.estado.toLowerCase() as OrderStatus,
    envio: {
      run: backendOrder.user?.run || "",
      nombres: backendOrder.user?.nombre || "",
      apellidos: backendOrder.user?.apellidos || "",
      correo: backendOrder.user?.correo || "",
      regionId: backendOrder.user?.regionId || "",
      regionNombre: backendOrder.user?.regionNombre || "",
      comuna: backendOrder.comuna,
      direccion: backendOrder.direccionEntrega,
      tipoEntrega: "", // Not stored
      metodoPago: "", // Not stored
    },
  };
};

const mapFrontendToBackend = (order: Order): any => {
  return {
    userId: parseInt(order.userId),
    // Backend expects LocalDateTime (ISO-8601 with time), but input is just date.
    // Appending T12:00:00 to make it a valid LocalDateTime.
    fechaEntrega: `${order.fechaEntrega}T12:00:00`,
    total: order.total,
    direccionEntrega: order.envio.direccion,
    regionNombre: "", // Needs to be passed or derived
    comuna: order.envio.comuna,
    items: order.items.map((i) => ({
      productoId: parseInt(i.codigo) || 0, // Use real ID if possible
      productoNombre: i.nombre,
      cantidad: i.cantidad,
      precioUnitario: i.precio,
      subtotal: i.precio * i.cantidad,
      mensaje: i.mensaje,
    })),
  };
};
