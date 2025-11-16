import type { Order, OrderStatus } from "@/types/order";

const STORAGE_KEY = "orders-cache-v1";

const loadOrders = (): Order[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};

const saveOrders = (orders: Order[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
};

export const orderService = {
  getAll(): Order[] {
    return loadOrders();
  },

  create(order: Order) {
    const orders = loadOrders();
    orders.push(order);
    saveOrders(orders);
  },

  updateStatus(id: string, status: OrderStatus) {
    const orders = loadOrders().map((o) =>
      o.id === id ? { ...o, status } : o
    );
    saveOrders(orders);
  },
};
