import { useState, useCallback, useEffect } from "react";
import { OrderContext } from "./OrderContext";
import type { Order, OrderStatus } from "@/types/order";
import { orderService } from "@/service/orderService";
import useAuth from "@/hooks/useAuth";

type Props = {
  children: React.ReactNode;
};

export const OrderProvider = ({ children }: Props) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { isAuthenticated } = useAuth();

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated) {
      setOrders([]);
      return;
    }
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = useCallback(async (order: Order) => {
    try {
      const newOrder = await orderService.create(order);
      setOrders((prev) => [...prev, newOrder]);
      return newOrder;
    } catch (error) {
      console.error("Failed to create order", error);
      throw error;
    }
  }, []);

  const updateStatus = useCallback(async (id: string, status: OrderStatus) => {
    try {
      const updatedOrder = await orderService.updateStatus(id, status);
      setOrders((prev) => prev.map((o) => (o.id === id ? updatedOrder : o)));
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  }, []);

  return (
    <OrderContext.Provider value={{ orders, createOrder, updateStatus }}>
      {children}
    </OrderContext.Provider>
  );
};
