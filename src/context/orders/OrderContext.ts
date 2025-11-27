import { createContext } from "react";
import type { Order } from "@/types/order";

export type OrderContextValue = {
  orders: Order[];
  createOrder: (order: Order) => Promise<Order>;
  updateStatus: (id: string, status: Order["status"]) => void;
};

export const OrderContext = createContext<OrderContextValue | null>(null);
