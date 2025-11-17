import { useState, useCallback } from "react";
import { OrderContext } from "./OrderContext";
import type { Order, OrderStatus } from "@/types/order";

import {
  getLocalOrders,
  saveLocalOrders,
} from "@/utils/storage/orderStorage";

type Props = {
  children: React.ReactNode;
};

export const OrderProvider = ({ children }: Props) => {
  const [orders, setOrders] = useState<Order[]>(() => getLocalOrders());

  const createOrder = useCallback((order: Order) => {
    const updated = [...orders, order];
    setOrders(updated);
    saveLocalOrders(updated);
  }, [orders]);

  const updateStatus = useCallback((id: string, status: OrderStatus) => {
    const updated = orders.map(o =>
      o.id === id ? { ...o, status } : o
    );
    setOrders(updated);
    saveLocalOrders(updated);
  }, [orders]);

  return (
    <OrderContext.Provider value={{ orders, createOrder, updateStatus }}>
      {children}
    </OrderContext.Provider>
  );
};
