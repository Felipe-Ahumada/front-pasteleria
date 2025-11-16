import { useState, useCallback } from "react";
import { OrderContext } from "./OrderContext";
import { orderService } from "@/service/orderService";
import type { Order } from "@/types/order";

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(() => orderService.getAll());

  const createOrder = useCallback((order: Order) => {
    orderService.create(order);
    setOrders(orderService.getAll());
  }, []);

  const updateStatus = useCallback((id: string, status: Order["status"]) => {
    orderService.updateStatus(id, status);
    setOrders(orderService.getAll());
  }, []);

  return (
    <OrderContext.Provider value={{ orders, createOrder, updateStatus }}>
      {children}
    </OrderContext.Provider>
  );
};
