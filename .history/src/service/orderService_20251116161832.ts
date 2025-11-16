import { readArray, writeJSON } from "@/utils/storage/localStorageUtils";
import type { Order, OrderStatus } from "@/types/order";

const STORAGE_KEY = "orders_v1";

export const orderService = {
  getAll(): Order[] {
    return readArray<Order>(STORAGE_KEY);
  },

  getById(id: string): Order | undefined {
    return readArray<Order>(STORAGE_KEY).find((o) => o.id === id);
  },

  create(order: Order): void {
    const all = readArray<Order>(STORAGE_KEY);
    all.push(order);
    writeJSON(STORAGE_KEY, all);
  },

  updateStatus(id: string, status: OrderStatus): void {
    const all = readArray<Order>(STORAGE_KEY).map((order) =>
      order.id === id ? { ...order, status } : order
    );

    writeJSON(STORAGE_KEY, all);
  },
};
