import type { Order } from "@/types/order";

const KEY = "orders";

export const getLocalOrders = (): Order[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

export const saveLocalOrders = (orders: Order[]) => {
  localStorage.setItem(KEY, JSON.stringify(orders));
};
