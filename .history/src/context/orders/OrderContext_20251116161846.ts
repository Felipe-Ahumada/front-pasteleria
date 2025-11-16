import { createContext } from "react";
import type { Order } from "@/types/order";

export type OrderContextType = {
  orders: Order[];
  createOrder: (order: Order) => void;
  updateStatus: (id: string, status: Order["status"]) => void;
};

export const OrderContext = createContext<OrderContextType | null>(null);
